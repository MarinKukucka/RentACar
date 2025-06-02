using Mediator;
using Microsoft.EntityFrameworkCore;
using RentACar.Application.Common.Interfaces;
using RentACar.Domain.Enums;

namespace RentACar.Application.Reservations.Commands.UpdateReservation
{
    public record UpdateReservationCommand : IRequest
    {
        public int Id { get; set; }

        public required ReservationStatus Status { get; set; }

        public DateTime? ConfirmedAt { get; set; }

        public DateTime? CancelledAt { get; set; }
    }

    public class UpdateReservationCommandHandler(IApplicationDbContext _context) : IRequestHandler<UpdateReservationCommand>
    {
        public async ValueTask<Unit> Handle(UpdateReservationCommand request, CancellationToken cancellationToken)
        {
            var entity = await _context.Reservations
                .Where(r => r.Id == request.Id)
                .FirstOrDefaultAsync(cancellationToken);

            request.Adapt(entity);

            await _context.SaveChangesAsync(cancellationToken);

            return Unit.Value;
        }
    }
}
