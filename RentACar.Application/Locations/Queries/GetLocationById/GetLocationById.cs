using Mediator;
using Microsoft.EntityFrameworkCore;
using RentACar.Application.Common.Interfaces;
using RentACar.Application.Locations.Dtos;

namespace RentACar.Application.Locations.Queries.GetLocationById
{
    public record GetLocationByIdQuery(int Id) : IRequest<LocationDto>;

    public class GetLocationByIdQueryHandler(IApplicationDbContext _context) : IRequestHandler<GetLocationByIdQuery, LocationDto>
    {
        public async ValueTask<LocationDto> Handle(GetLocationByIdQuery request, CancellationToken cancellationToken)
        {
            return await _context.Locations
                .AsNoTrackingWithIdentityResolution()
                .Where(l => l.Id == request.Id)
                .ProjectToType<LocationDto>()
                .FirstOrDefaultAsync(cancellationToken) ?? throw new KeyNotFoundException();
        }
    }
}
