using Mediator;
using Microsoft.EntityFrameworkCore;
using RentACar.Application.Common.Interfaces;
using RentACar.Application.Reservations.Dtos;

namespace RentACar.Application.Reservations.Queries.GetTodaysReservations
{
    public record GetTodaysReservationsQuery : IRequest<List<ReservationDto>>;

    public class GetTodaysReservationsQueryHandler(IApplicationDbContext _context) : IRequestHandler<GetTodaysReservationsQuery, List<ReservationDto>>
    {
        public async ValueTask<List<ReservationDto>> Handle(GetTodaysReservationsQuery request, CancellationToken cancellationToken)
        {
            return await _context.Reservations
                .AsNoTrackingWithIdentityResolution()
                .Where(r => r.StartDateTime.Date == DateTime.Today)
                .ProjectToType<ReservationDto>()
                .ToListAsync(cancellationToken);
        }
    }
}
