using Mediator;
using Microsoft.EntityFrameworkCore;
using RentACar.Application.Common.Interfaces;
using RentACar.Application.People.Dtos;

namespace RentACar.Application.People.Commands.UpdatePerson
{
    public class UpdatePersonCommand : IRequest<PersonDto?>
    {
        public int Id { get; set; }
        public string? FirstName { get; set; }
        public string? LastName { get; set; }
        public string? PhoneNumber { get; set; }

        public bool CreateUser { get; set; }
        public string? Role { get; set; }
    }

    public class UpdatePersonCommandHandler(IApplicationDbContext context, IMapper mapper) : IRequestHandler<UpdatePersonCommand, PersonDto?>
    {
        public async ValueTask<PersonDto?> Handle(UpdatePersonCommand request, CancellationToken cancellationToken)
        {
            var person = await context.People
                .SingleOrDefaultAsync(p => p.Id == request.Id, cancellationToken: cancellationToken);

            mapper.Map(request, person);

            await context.SaveChangesAsync(cancellationToken);

            return person.Adapt<PersonDto>();
        }
    }
}
