using Mediator;
using Microsoft.AspNetCore.Identity;
using RentACar.Application.Common.Interfaces;
using RentACar.Application.People.Dtos;
using RentACar.Domain.Entities;
using System.Net;

namespace RentACar.Application.People.Commands.CreateUserAndPerson
{
    public record CreateUserAndPersonCommand : IRequest<PersonDto>
    {
        public string? FirstName { get; set; }
        public string? LastName { get; set; }
        public string? PhoneNumber { get; set; }

        public string Email { get; set; } = string.Empty;
        public string? Role { get; set; }
    }

    public class CreateUserAndPersonCommandHandler(
        IApplicationDbContext context,
        IEmailSender<ApplicationUser> emailSender,
        UserManager<ApplicationUser> userManager
        ) : IRequestHandler<CreateUserAndPersonCommand, PersonDto>
    {
        public async ValueTask<PersonDto> Handle(CreateUserAndPersonCommand request, CancellationToken cancellationToken)
        {
            var person = request.Adapt<Person>();
            person.IsActive = true;

            await context.People.AddAsync(person, cancellationToken);

            await context.SaveChangesAsync(cancellationToken);

            var user = new ApplicationUser
            {
                UserName = request.Email,
                Email = request.Email,
                EmailConfirmed = false,
                PersonId = person.Id
            };
            await userManager.CreateAsync(user);

            var token = await userManager.GeneratePasswordResetTokenAsync(user);
            var encodedToken = WebUtility.UrlEncode(token);

            string _frontendBaseUrl = "https://localhost:52044";

            var link = $"{_frontendBaseUrl}/SetPassword?email={WebUtility.UrlEncode(request.Email)}&token={encodedToken}";

            await emailSender.SendConfirmationLinkAsync(person, request.Email, link);

            return person.Adapt<PersonDto>();
        }
    }
}
