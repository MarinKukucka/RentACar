using Mediator;
using Microsoft.EntityFrameworkCore;
using RentACar.Application.Common.Extensions;
using RentACar.Application.Common.Interfaces;
using RentACar.Application.Common.Models.Pagination;
using RentACar.Application.Reservations.Dtos;

namespace RentACar.Application.Reservations.Queries.GetPaginatedReservation
{
    public record ReservationsFilter(int? Id, DateTime? StartDateTime, DateTime? EndDateTime, int? Status);

    public record GetPaginatedReservationQuery : IRequest<PaginationResponse<ReservationDto>>
    {
        public PaginationFilter<ReservationsFilter> PaginationFilter { get; set; } = new PaginationFilter<ReservationsFilter>();
    }

    public class GetPaginatedReservationQueryHandler(IApplicationDbContext _context) : IRequestHandler<GetPaginatedReservationQuery, PaginationResponse<ReservationDto>>
    {
        public async ValueTask<PaginationResponse<ReservationDto>> Handle(GetPaginatedReservationQuery request, CancellationToken cancellationToken)
        {
            return await _context.Reservations
                .AsNoTrackingWithIdentityResolution()
                .Include(r => r.Person)
                .Include(r => r.PickupLocation)
                .Include(r => r.ReturnLocation)
                .Include(r => r.ExtraServices)
                .Where(r => r.Person != null)
                .Filter(request.PaginationFilter.Filter)
                .Sort(request.PaginationFilter.SortBy, request.PaginationFilter.SortOrder)
                .Select(r => new ReservationDto
                {
                    Id = r.Id,
                    StartDateTime = r.StartDateTime,
                    EndDateTime = r.EndDateTime,
                    Status = r.Status,
                    ConfirmedAt = r.ConfirmedAt,
                    CancelledAt = r.CancelledAt,
                    TotalPrice = r.TotalPrice,
                    Notes = r.Notes,
                    PersonName = r.Person!.FirstName + " " + r.Person.LastName,
                    PickupLocationName = r.PickupLocation!.Name,
                    ReturnLocationName = r.ReturnLocation!.Name,
                    ExtraServices = r.ExtraServices != null ? r.ExtraServices.Select(es => es.Name).ToList() : null
                }) 
                .AsSplitQuery()
                .PaginatedListAsync(request.PaginationFilter.CurrentPage, request.PaginationFilter.PageSize);
        }
    }
}
