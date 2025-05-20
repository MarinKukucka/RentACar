using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.WebUtilities;
using Microsoft.EntityFrameworkCore;
using RentACar.Application.Common.Interfaces;
using RentACar.Application.People.Dtos;
using RentACar.Domain.Entities;
using RentACar.Infrastructure.Config;
using System.Text;

namespace RentACar.Infrastructure.Identity
{
    public class IdentityService(UserManager<ApplicationUser> userManager,
    IHttpContextAccessor httpContextAccessor,
    RoleManager<IdentityRole> roleManager,
    IUserClaimsPrincipalFactory<ApplicationUser> userClaimsPrincipalFactory,
    Services.IEmailSender<ApplicationUser> emailSender,
    IAuthorizationService authorizationService) : IIdentityService
    {
        public async Task<string?> GetUserNameAsync(string userId)
        {
            var user = await userManager.FindByIdAsync(userId);

            return user?.UserName;
        }

        public async Task<bool> IsInRoleAsync(string userId, string role)
        {
            var user = await userManager.FindByIdAsync(userId);

            return user != null && await userManager.IsInRoleAsync(user, role);
        }

        public async Task<bool> AuthorizeAsync(string userId, string policyName)
        {
            var user = await userManager.FindByIdAsync(userId);

            if (user == null)
            {
                return false;
            }

            var principal = await userClaimsPrincipalFactory.CreateAsync(user);

            var result = await authorizationService.AuthorizeAsync(principal, policyName);

            return result.Succeeded;
        }

        public async Task DisableUserAsync(string userId)
        {
            var user = await userManager.FindByIdAsync(userId);

            if (user != null)
            {
                var lockoutEndDate = DateTimeOffset.UtcNow.AddYears(100);

                await userManager.SetLockoutEndDateAsync(user, lockoutEndDate);
            }
        }

        public async Task EnableUserAsync(string userId)
        {
            var user = await userManager.FindByIdAsync(userId);
            if (user != null)
            {
                await userManager.SetLockoutEndDateAsync(user, null);
            }
        }

        public async Task<string> CreateUserAsync(CreateUserDto createUserDto)
        {
            // Check for existing user
            if (!string.IsNullOrWhiteSpace(createUserDto.Email) &&
                await userManager.FindByNameAsync(createUserDto.Email) != null)
            {
                throw new ArgumentException($"User with email '{createUserDto.Email}' already exists");
            }

            var user = new ApplicationUser
            {
                Email = createUserDto.Email,
                UserName = createUserDto.Email,
                PersonId = createUserDto.PersonId,
                EmailConfirmed = true
            };

            IdentityResult createResult;
            try
            {
                createResult = await userManager.CreateAsync(user, createUserDto.Password);
            }
            catch (DbUpdateException dbEx)
            {
                // Log dbEx.InnerException for deeper details
                throw new InvalidOperationException("Database error while creating user", dbEx);
            }

            if (!createResult.Succeeded)
            {
                // Aggregate all identity errors
                var errorDescriptions = createResult.Errors
                    .Select(e => e.Description)
                    .ToArray();

                var combined = string.Join("; ", errorDescriptions);
                throw new InvalidOperationException($"Failed to create user: {combined}");
            }

            // Assign role if specified
            if (!string.IsNullOrWhiteSpace(createUserDto.Role))
            {
                if (await roleManager.RoleExistsAsync(createUserDto.Role))
                {
                    var roleResult = await userManager.AddToRoleAsync(user, createUserDto.Role);
                    if (!roleResult.Succeeded)
                    {
                        var roleErrors = string.Join("; ", roleResult.Errors.Select(e => e.Description));
                        throw new InvalidOperationException($"Failed to add role '{createUserDto.Role}': {roleErrors}");
                    }
                }
                else
                {
                    throw new ArgumentException($"Role '{createUserDto.Role}' does not exist");
                }
            }

            // Send confirmation link (may also throw)
            await SendConfirmationLinkAsync(user);
            return user.Id;
        }


        private async Task SendConfirmationLinkAsync(ApplicationUser user)
        {
            var request = httpContextAccessor.HttpContext?.Request;
            var confirmEmailToken = await userManager.GenerateEmailConfirmationTokenAsync(user);
            var code = WebEncoders.Base64UrlEncode(Encoding.UTF8.GetBytes(confirmEmailToken));

            var link = $"{GetClientConfig()?.SetPasswordUri}?userId={user.Id}&code={code}";

            await emailSender.SendConfirmationLinkAsync(user, user.Email!, link);
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
