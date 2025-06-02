using Mediator;
using Microsoft.EntityFrameworkCore;
using RentACar.Application.Common.Interfaces;
using RentACar.Domain.Entities;
using RentACar.Domain.Enums;

namespace RentACar.Application.Reservations.Commands.CreateReservation
{

    public record CreateReservationCommand : IRequest<int>
    {
        public required DateTime StartDateTime { get; set; }

        public required DateTime EndDateTime { get; set; }

        public required decimal TotalPrice { get; set; }
        
        public string? Notes { get; set; }

        public int VehicleId { get; set; }

        public int PickupLocationId { get; set; }

        public List<int>? ReservationExtrasIds { get; set; }
    }

    public class CreateReservationCommandHandler(IApplicationDbContext _context) : IRequestHandler<CreateReservationCommand, int>
    {
        public async ValueTask<int> Handle(CreateReservationCommand request, CancellationToken cancellationToken)
        {
            var reservation = request.Adapt<Reservation>();
            reservation.Status = ReservationStatus.Pending;

            if (request.ReservationExtrasIds != null && request.ReservationExtrasIds.Count != 0)
            {
                var extraServices = await _context.ExtraServices
                    .Where(es => request.ReservationExtrasIds.Contains(es.Id))
                    .ToListAsync(cancellationToken);

                reservation.ExtraServices = extraServices;
            }

            _context.Reservations.Add(reservation);

            await _context.SaveChangesAsync(cancellationToken);

            return reservation.Id;
        }
    }
}
