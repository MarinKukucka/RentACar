using Mediator;
using RentACar.Application.Common.Interfaces;
using RentACar.Domain.Entities;
using RentACar.Domain.Enums;

namespace RentACar.Application.Rentals.Commands.CreateRental
{
    public record CreateRentalCommand : IRequest
    {
        public required DateTime PickupDateTime { get; set; }

        public required int OdometerStart { get; set; }

        public string? Notes { get; set; }

        public int ReservationId { get; set; }
    }

    public class CreateRentalCommandHandler(IApplicationDbContext _context) : IRequestHandler<CreateRentalCommand>
    {
        public async ValueTask<Unit> Handle(CreateRentalCommand request, CancellationToken cancellationToken)
        {
            var rental = request.Adapt<Rental>();
            rental.Status = RentalStatus.PickedUp;

            _context.Rentals.Add(rental);

            await _context.SaveChangesAsync(cancellationToken);

            return Unit.Value;
        }
    }
}
