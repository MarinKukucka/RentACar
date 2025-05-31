using Mediator;
using Microsoft.EntityFrameworkCore;
using RentACar.Application.Common.Interfaces;
using RentACar.Application.Vehicles.Dtos;

namespace RentACar.Application.Vehicles.Queries.GetSimpleVehicles
{
    public record GetSimpleVehiclesQuery : IRequest<List<SimpleVehicleDto>>;

    public class GetSimpleVehiclesQueryHandler(IApplicationDbContext _context) : IRequestHandler<GetSimpleVehiclesQuery, List<SimpleVehicleDto>>
    {
        public async ValueTask<List<SimpleVehicleDto>> Handle(GetSimpleVehiclesQuery request, CancellationToken cancellationToken)
        {
            return await _context.Vehicles
                .AsNoTrackingWithIdentityResolution()
                .Where(v => v.IsAvailable)
                .Select(v => new SimpleVehicleDto {
                    Id = v.Id,
                    Name = v.Model != null && v.Model.Brand != null ? v.Model.Brand.Name + " " + v.Model.Name.ToString() : "",
                    Image = v.Model != null && v.Model.File != null ? v.Model.File.Path : null,
                    Price = v.Price
                })
                .ToListAsync(cancellationToken);
        }
    }
}
