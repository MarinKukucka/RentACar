using Mapster;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Http.HttpResults;
using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.WebUtilities;
using RentACar.Application.People.Commands.UpdatePerson;
using RentACar.Application.People.Dtos;
using RentACar.Application.People.Queries.GetPerson;
using RentACar.Domain.Entities;
using RentACar.Infrastructure.Config;
using RentACar.Infrastructure.Identity.Models;
using System.ComponentModel.DataAnnotations;
using System.Text;

namespace RentACar.Server.Controllers
{
    public class IdentityController(UserManager<ApplicationUser> userManager, Application.Common.Interfaces.IEmailSender<ApplicationUser> emailSender, LinkGenerator linkGenerator, IMediator mediator) : ApiController
    {
        [HttpGet("confirm-email")]
        [ProducesResponseType(StatusCodes.Status302Found)]
        [ProducesResponseType(StatusCodes.Status400BadRequest)]
        [EndpointName(nameof(ConfirmEmail))]
        public async Task<Results<RedirectHttpResult, UnauthorizedHttpResult, ValidationProblem>> ConfirmEmail(
        [FromQuery] string userId,
        [FromQuery] string code,
        [FromQuery] string redirectUrl,
        [FromQuery] string? changedEmail
        )
        {
            if (await userManager.FindByIdAsync(userId) is not { } user)
            {
                return TypedResults.Unauthorized();
            }

            var emailAlreadyConfirmed = user.EmailConfirmed && changedEmail == null;
            var emailChangeAlreadyConfirmed = user.EmailConfirmed && changedEmail != null && user.Email == changedEmail;

            if (emailAlreadyConfirmed || emailChangeAlreadyConfirmed)
            {
                return TypedResults.Redirect(redirectUrl);
            }

            try
            {
                code = Encoding.UTF8.GetString(WebEncoders.Base64UrlDecode(code));
            }
            catch (FormatException)
            {
                return TypedResults.Unauthorized();
            }

            IdentityResult result;

            if (string.IsNullOrEmpty(changedEmail))
            {
                result = await userManager.ConfirmEmailAsync(user, code);
            }
            else
            {
                result = await userManager.ChangeEmailAsync(user, changedEmail, code);

                if (result.Succeeded)
                {
                    result = await userManager.SetUserNameAsync(user, changedEmail);
                }
            }

            if (!result.Succeeded)
            {
                return TypedResults.Unauthorized();
            }

            return TypedResults.Redirect(redirectUrl);
        }

        [HttpGet("manage/info")]
        [ProducesResponseType(typeof(UserInfoResponse), StatusCodes.Status200OK)]
        [ProducesResponseType(StatusCodes.Status404NotFound)]
        [Authorize]
        public async Task<ActionResult<UserInfoResponse>> GetUserInfo()
        {
            var user = await userManager.FindByEmailAsync(HttpContext.User?.Identity?.Name!);

            if (user is null)
                return NotFound();

            var person = await mediator.Send(new GetPersonQuery { PersonId = user.PersonId });

            return Ok(CreateInfoResponseAsync(user, person));
        }

        [HttpPost("manage/info")]
        [ProducesResponseType(typeof(UserInfoResponse), StatusCodes.Status200OK)]
        [ProducesResponseType(StatusCodes.Status400BadRequest)]
        [ProducesResponseType(StatusCodes.Status404NotFound)]
        [Authorize]
        public async Task<Results<Ok<UserInfoResponse>, ValidationProblem, NotFound>> ManageUserInfo([FromBody] UpdateUserInfoRequest updateUserInfo)
        {
            var user = await userManager.FindByEmailAsync(HttpContext.User?.Identity?.Name!);

            if (user is null) return TypedResults.NotFound();

            if (!string.IsNullOrEmpty(updateUserInfo.Email) && !new EmailAddressAttribute().IsValid(updateUserInfo.Email))
            {
                return TypedResults.NotFound();
            }

            if (!string.IsNullOrEmpty(updateUserInfo.NewPassword))
            {
                if (string.IsNullOrEmpty(updateUserInfo.OldPassword))
                {
                    return TypedResults.ValidationProblem(new Dictionary<string, string[]> { { "OldPasswordRequired", ["The old password is required to set a new password."] } });
                }

                var changePasswordResult = await userManager.ChangePasswordAsync(user, updateUserInfo.OldPassword, updateUserInfo.NewPassword);

                if (!changePasswordResult.Succeeded)
                {
                    return TypedResults.NotFound();
                }
            }

            if (!string.IsNullOrEmpty(updateUserInfo.Email))
            {
                var email = await userManager.GetEmailAsync(user);

                if (email != updateUserInfo.Email)
                {
                    var existingUser = await userManager.FindByEmailAsync(updateUserInfo.Email);

                    if (existingUser != null)
                    {
                        return TypedResults.NotFound();
                    }

                    await SendConfirmationLinkAsync(user, updateUserInfo.Email);
                }
            }

            await userManager.UpdateAsync(user);

            var person = updateUserInfo.Adapt<UpdatePersonCommand>();
            person.Id = user.PersonId;

            await mediator.Send(person);

            var result = await mediator.Send(new GetPersonQuery { PersonId = user.PersonId });
            return TypedResults.Ok(CreateInfoResponseAsync(user, result));
        }

        private static UserInfoResponse CreateInfoResponseAsync(ApplicationUser user, Application.People.Dtos.PersonDto person)
        {
            var userInfoResponse = person.Adapt<UserInfoResponse>();
            userInfoResponse.Email = user.Email;
            userInfoResponse.IsEmailConfirmed = user.EmailConfirmed;
            return userInfoResponse;
        }

        private async Task SendConfirmationLinkAsync(ApplicationUser user, string? newEmail = null)
        {
            var email = newEmail ?? user.Email!;

            var code = newEmail != null
                ? await userManager.GenerateChangeEmailTokenAsync(user, email)
                : await userManager.GenerateEmailConfirmationTokenAsync(user);

            var userId = await userManager.GetUserIdAsync(user);

            var routeValues = new RouteValueDictionary()
            {
                ["userId"] = userId,
                ["code"] = WebEncoders.Base64UrlEncode(Encoding.UTF8.GetBytes(code)),
                ["redirectUrl"] = CreateEmailConfirmReturnUrl()
            };

            if (newEmail != null)
            {
                routeValues.Add("changedEmail", email);
            }

            var confirmationLink = linkGenerator.GetUriByName(HttpContext, nameof(ConfirmEmail), routeValues);

            await emailSender.SendConfirmationLinkAsync(user, email, confirmationLink!);
        }

        private async Task SendPasswordResetLinkAsync(ApplicationUser user)
        {
            var code = await userManager.GeneratePasswordResetTokenAsync(user);
            var resetLink = CreatePasswordResetUrl(WebEncoders.Base64UrlEncode(Encoding.UTF8.GetBytes(code)));

            await emailSender.SendPasswordResetLinkAsync(user, user.Email!, resetLink);
        }


        private static string CreateEmailConfirmReturnUrl()
        {
            var redirectUrl = $"{GetClientConfig()?.LoginUrl}?emailConfirmed=true";

            return redirectUrl;
        }

        private static string CreatePasswordResetUrl(string code)
        {
            var resetUrl = $"{GetClientConfig()?.ResetPasswordUri}?code={code}";
            return resetUrl;
        }


        private static ClientConfig? GetClientConfig()
        {
            return new ClientConfig
            {
                ClientId = "web-client",
                DisplayName = "Web client",
                LoginUrl = "https://localhost:50244/Login",
                RedirectUri = "https://localhost:50244/Callback",
                ResetPasswordUri = "https://localhost:50244/ResetPassword",
                SetPasswordUri = "https://localhost:50244/SetPassword",
                PostLogoutRedirectUri = "https://localhost:50244"
            };
        }
    }
}
