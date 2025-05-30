using Mediator;
using Microsoft.EntityFrameworkCore;
using RentACar.Application.Common.Interfaces;
using RentACar.Application.Locations.Dtos;

namespace RentACar.Application.Locations.Queries.GetLocations
{
    public record GetLocationsQuery : IRequest<List<LocationDto>>;

    public class GetLocationsQueryHandler(IApplicationDbContext _context) : IRequestHandler<GetLocationsQuery, List<LocationDto>>
    {
        public async ValueTask<List<LocationDto>> Handle(GetLocationsQuery request, CancellationToken cancellationToken)
        {
            return await _context.Locations
                .AsNoTrackingWithIdentityResolution()
                .Include(l => l.City)
                .Select(l => new LocationDto
                {
                    Id = l.Id,
                    Name = l.Name,
                    Address = l.Address,
                    PhoneNumber = l.PhoneNumber,
                    City = l.City != null ? l.City.Name : "",
                    Image = l.File != null ? l.File.Path : ""
                })
                .ToListAsync(cancellationToken);    
        }
    }
}
