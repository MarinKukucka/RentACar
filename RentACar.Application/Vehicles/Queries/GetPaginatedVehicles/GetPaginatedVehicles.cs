using Mediator;
using Microsoft.EntityFrameworkCore;
using RentACar.Application.Common.Extensions;
using RentACar.Application.Common.Interfaces;
using RentACar.Application.Common.Models.Pagination;
using RentACar.Application.Vehicles.Dtos;
using RentACar.Domain.Enums;

namespace RentACar.Application.Vehicles.Queries.GetPaginatedVehicles
{
    public record VehiclesFilter(string? VIN, string? LicensePlate, int? Year, int? Mileage, VehicleType? VehicleType, Transmission? Transmission, FuelType? FuelType, decimal Price);

    public record GetPaginatedVehiclesQuery : IRequest<PaginationResponse<VehicleDto>>
    {
        public PaginationFilter<VehiclesFilter> PaginationFilter { get; set; } = new PaginationFilter<VehiclesFilter>();
    }

    public class GetPaginatedVehiclesQueryHandler(IApplicationDbContext _context) : IRequestHandler<GetPaginatedVehiclesQuery, PaginationResponse<VehicleDto>>
    {
        public async ValueTask<PaginationResponse<VehicleDto>> Handle(GetPaginatedVehiclesQuery request, CancellationToken cancellationToken)
        {
            return await _context.Vehicles
                .AsNoTrackingWithIdentityResolution()
                .Filter(request.PaginationFilter.Filter)
                .Sort(request.PaginationFilter.SortBy, request.PaginationFilter.SortOrder)
                .ProjectToType<VehicleDto>()
                .PaginatedListAsync(request.PaginationFilter.CurrentPage, request.PaginationFilter.PageSize);
        }
    }
}
