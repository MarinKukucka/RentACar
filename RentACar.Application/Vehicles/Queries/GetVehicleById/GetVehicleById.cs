using Mediator;
using Microsoft.EntityFrameworkCore;
using RentACar.Application.Common.Interfaces;
using RentACar.Application.Vehicles.Dtos;

namespace RentACar.Application.Vehicles.Queries.GetVehicleById
{
    public record GetVehicleByIdQuery(int Id) : IRequest<VehicleDto>;

    public class GetVehicleByIdQueryHandler(IApplicationDbContext _context) : IRequestHandler<GetVehicleByIdQuery, VehicleDto>
    {
        public async ValueTask<VehicleDto> Handle(GetVehicleByIdQuery request, CancellationToken cancellationToken)
        {
            return await _context.Vehicles
                .AsNoTrackingWithIdentityResolution()
                .Where(v => v.Id == request.Id)
                .ProjectToType<VehicleDto>()
                .FirstOrDefaultAsync(cancellationToken) ?? throw new KeyNotFoundException();
        }
    }
}
