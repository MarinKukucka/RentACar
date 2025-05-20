using Mediator;
using Microsoft.EntityFrameworkCore;
using RentACar.Application.Common.Interfaces;

namespace RentACar.Application.People.Commands.DeactivatePerson
{
    public class DeactivatePersonCommand : IRequest
    {
        public int PersonId { get; set; }
    }

    public class DeactivatePersonCommandHandler(
        IIdentityService identityService,
        IApplicationDbContext context
        ) : IRequestHandler<DeactivatePersonCommand, Unit>
    {
        public async ValueTask<Unit> Handle(DeactivatePersonCommand request, CancellationToken cancellationToken)
        {
            var person = await context.People.Include(x => x.User).SingleOrDefaultAsync(x => x.Id == request.PersonId, cancellationToken: cancellationToken);

            if (person is null)
            {
                return Unit.Value;
            }

            person.IsActive = false;

            await context.SaveChangesAsync(cancellationToken);

            if (!string.IsNullOrEmpty(person?.User?.Id))
            {
                await identityService.DisableUserAsync(person.User.Id);
            }

            return Unit.Value;
        }
    }
}
