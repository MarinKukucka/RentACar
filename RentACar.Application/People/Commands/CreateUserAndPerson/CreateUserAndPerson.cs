using Mediator;
using RentACar.Application.Common.Interfaces;
using RentACar.Application.People.Dtos;
using RentACar.Domain.Entities;

namespace RentACar.Application.People.Commands.CreateUserAndPerson
{
    public record CreateUserAndPersonCommand : IRequest<PersonDto>
    {
        public string? FirstName { get; set; }
        public string? LastName { get; set; }
        public string? PhoneNumber { get; set; }

        public string? Email { get; set; }
        public string? Password { get; set; }
        public string? Role { get; set; }
    }

    public class CreateUserAndPersonCommandHandler(
        IApplicationDbContext context,
        IIdentityService identityService
        ) : IRequestHandler<CreateUserAndPersonCommand, PersonDto>
    {
        public async ValueTask<PersonDto> Handle(CreateUserAndPersonCommand request, CancellationToken cancellationToken)
        {
            
            var person = request.Adapt<Person>();
            person.IsActive = true;

            await context.People.AddAsync(person, cancellationToken);

            await context.SaveChangesAsync(cancellationToken);

            var createUser = request.Adapt<CreateUserDto>();
            createUser.PersonId = person.Id;

            await identityService.CreateUserAsync(createUser);

            await context.SaveChangesAsync(cancellationToken);
            return person.Adapt<PersonDto>();
            
        }
    }
}
