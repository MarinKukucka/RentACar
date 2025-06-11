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
                .Where(r => r.ReturnDateTime.HasValue && r.ReturnDateTime.Value.Date == DateTime.Today)
                .ProjectToType<RentalDto>()
                .ToListAsync(cancellationToken);
        }
    }
}
