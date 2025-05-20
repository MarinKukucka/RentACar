using Mediator;
using Microsoft.EntityFrameworkCore;
using RentACar.Application.Common.Interfaces;
using RentACar.Application.People.Dtos;

namespace RentACar.Application.People.Queries.GetPerson
{
    public record GetPersonQuery : IRequest<PersonDto>
    {
        public int PersonId { get; init; }
    }

    public class GetPersonQueryHandler(IApplicationDbContext context) : IRequestHandler<GetPersonQuery, PersonDto>
    {
        public async ValueTask<PersonDto> Handle(GetPersonQuery request, CancellationToken cancellationToken)
        {
            var person = await context.People
                .Include(p => p.User)
                .AsNoTracking()
                .SingleOrDefaultAsync(x => x.Id == request.PersonId, cancellationToken);

            return person.Adapt<PersonDto>();
        }
    }
}
