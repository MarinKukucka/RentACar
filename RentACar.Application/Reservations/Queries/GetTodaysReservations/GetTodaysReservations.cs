using Mediator;
using Microsoft.EntityFrameworkCore;
using RentACar.Application.Common.Interfaces;
using RentACar.Application.Files.Dtos;
using RentACar.Application.Reservations.Dtos;

namespace RentACar.Application.Reservations.Queries.GetTodaysReservations
{
    public record GetTodaysReservationsQuery : IRequest<List<ReservationDto>>;

    public class GetTodaysReservationsQueryHandler(IApplicationDbContext _context) : IRequestHandler<GetTodaysReservationsQuery, List<ReservationDto>>
    {
        public async ValueTask<List<ReservationDto>> Handle(GetTodaysReservationsQuery request, CancellationToken cancellationToken)
        {
            return await _context.Reservations
                .AsNoTrackingWithIdentityResolution()
                .Where(r => r.StartDateTime.Date == DateTime.Today)
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
                    ExtraServices = r.ExtraServices != null ? r.ExtraServices.Select(es => es.Name).ToList() : null,
                    Invoice = r.Invoices != null ? r.Invoices.Where(i => i.File != null).Select(i => i.File).Select(f => new FileDto
                    {
                        Id = f!.Id,
                        Name = f.Name,
                        Path = f.Path
                    }).FirstOrDefault() : null
                })
                .ToListAsync(cancellationToken);
        }
    }
}
