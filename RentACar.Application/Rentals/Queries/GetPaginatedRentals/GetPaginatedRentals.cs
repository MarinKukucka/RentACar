using Mediator;
using Microsoft.EntityFrameworkCore;
using RentACar.Application.Common.Extensions;
using RentACar.Application.Common.Interfaces;
using RentACar.Application.Common.Models.Pagination;
using RentACar.Application.Rentals.Dtos;

namespace RentACar.Application.Rentals.Queries.GetPaginatedRentals
{
    public record RentalsFilter(int? Id, int? Status);

    public record GetPaginatedRentalsQuery : IRequest<PaginationResponse<RentalDto>>
    {
        public PaginationFilter<RentalsFilter> PaginationFilter { get; set; } = new PaginationFilter<RentalsFilter>();
    }

    public class GetPaginatedRentalsQueryHandler(IApplicationDbContext _context) : IRequestHandler<GetPaginatedRentalsQuery, PaginationResponse<RentalDto>>
    {
        public async ValueTask<PaginationResponse<RentalDto>> Handle(GetPaginatedRentalsQuery request, CancellationToken cancellationToken)
        {
            return await _context.Rentals
                .AsNoTrackingWithIdentityResolution()
                .Filter(request.PaginationFilter.Filter)
                .Sort(request.PaginationFilter.SortBy, request.PaginationFilter.SortOrder)
                .ProjectToType<RentalDto>()
                .PaginatedListAsync(request.PaginationFilter.CurrentPage, request.PaginationFilter.PageSize);
        }
    }
}
