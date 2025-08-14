using Mediator;
using Microsoft.EntityFrameworkCore;
using RentACar.Application.Common.Interfaces;
using RentACar.Application.Rentals.Dtos;

namespace RentACar.Application.Rentals.Queries.GetTodaysRentals
{
    public record GetTodaysRentalsQuery : IRequest<List<RentalDto>>;

    public class GetTodaysRentalsQueryHandler(IApplicationDbContext _context) : IRequestHandler<GetTodaysRentalsQuery, List<RentalDto>>
    {
        public async ValueTask<List<RentalDto>> Handle(GetTodaysRentalsQuery request, CancellationToken cancellationToken)
        {
            return await _context.Rentals
                .AsNoTrackingWithIdentityResolution()
                .Where(r => r.Reservation != null && r.Reservation.EndDateTime.Date == DateTime.Today)
                .Select(rental => new RentalDto
                {
                    Id = rental.Id,
                    Status = rental.Status,
                    PickupDateTime = rental.PickupDateTime,
                    ReturnDateTime = rental.ReturnDateTime,
                    OdometerStart = rental.OdometerStart,
                    OdometerEnd = rental.OdometerEnd,
                    TotalPrice = rental.TotalPrice,
                    PersonName = rental.Reservation!.Person!.FirstName + " " + rental.Reservation.Person.LastName,
                    ReservationEnd = rental.Reservation.EndDateTime
                })
                .ToListAsync(cancellationToken);
        }
    }
}
