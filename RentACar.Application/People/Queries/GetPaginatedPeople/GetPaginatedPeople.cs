using Mediator;
using Microsoft.EntityFrameworkCore;
using RentACar.Application.Common.Extensions;
using RentACar.Application.Common.Interfaces;
using RentACar.Application.Common.Models.Pagination;
using RentACar.Application.People.Dtos;

namespace RentACar.Application.People.Queries.GetPaginatedPeople
{
    public record PeopleFilter(string? FirstName, string? LastName, string? PhoneNumber);

    public record GetPaginatedPeopleQuery : IRequest<PaginationResponse<PersonDto>>
    {
        public PaginationFilter<PeopleFilter> PaginationFilter { get; set; } = new PaginationFilter<PeopleFilter>();
    }

    public class GetPaginatedPeopleQueryHandler(IApplicationDbContext _context) : IRequestHandler<GetPaginatedPeopleQuery, PaginationResponse<PersonDto>>
    {
        public async ValueTask<PaginationResponse<PersonDto>> Handle(GetPaginatedPeopleQuery request, CancellationToken cancellationToken)
        {
            return await _context.People
                .AsNoTrackingWithIdentityResolution()
                .Where(p => !p.IsCustomer)
                .Filter(request.PaginationFilter.Filter)
                .Sort(request.PaginationFilter.SortBy, request.PaginationFilter.SortOrder)
                .ProjectToType<PersonDto>()
                .PaginatedListAsync(request.PaginationFilter.CurrentPage, request.PaginationFilter.PageSize);
        }
    }
}
