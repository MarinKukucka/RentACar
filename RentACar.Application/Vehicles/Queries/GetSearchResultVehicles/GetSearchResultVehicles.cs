using Mediator;
using Microsoft.EntityFrameworkCore;
using RentACar.Application.Common.Interfaces;
using RentACar.Application.Models.Dtos;
using RentACar.Application.Vehicles.Dtos;

namespace RentACar.Application.Vehicles.Queries.GetSearchResultVehicles
{
    public record GetSearchResultVehiclesQuery : IRequest<List<VehicleDto>>
    {
        public int? PickupLocationId { get; set; }

        public DateTime? PickupDate { get; set; }

        public DateTime? DropOffDate { get; set; }
    }

    public class GetSearchResultVehiclesQueryHandler(IApplicationDbContext _context) : IRequestHandler<GetSearchResultVehiclesQuery, List<VehicleDto>>
    {
        public async ValueTask<List<VehicleDto>> Handle(GetSearchResultVehiclesQuery request, CancellationToken cancellationToken)
        {
            var pickupDate = request.PickupDate?.Date;
            var dropOffDate = request.DropOffDate?.Date;

            return await _context.Vehicles
                .AsNoTrackingWithIdentityResolution()
                .Include(v => v.Location)
                .Include(v => v.Reservations)
                .Include(v => v.Model)
                    .ThenInclude(m => m!.File)
                .Include(v => v.Model)
                    .ThenInclude(m => m!.Brand)
                .Where(v =>
                    v.LocationId == request.PickupLocationId
                    &&
                    !v.Reservations!.Any(r =>
                        r.StartDateTime < dropOffDate!.Value
                        && r.EndDateTime > pickupDate!.Value
                    )
                    &&
                    v.Location != null
                    &&
                    v.Model != null
                    &&
                    v.Model.Brand != null
                    &&
                    v.Model.File != null
                )
                .Select(v => new VehicleDto
                {
                    Id = v.Id,
                    VIN = v.VIN,
                    LicensePlate = v.LicensePlate,
                    Location = v.Location!.Name,
                    Price = v.Price,
                    VehicleType = v.VehicleType,
                    Transmission = v.Transmission,
                    Seats = v.Seats,
                    Model = new ModelDto
                    {
                        Id = v.Model!.Id,
                        BrandName = v.Model.Brand!.Name,
                        ModelName = v.Model.Name,
                        Image = v.Model.File!.Path
                    }
                })
                .ToListAsync(cancellationToken);
        }
    }
}
