using Mediator;
using Microsoft.EntityFrameworkCore;
using RentACar.Application.Common.Interfaces;
using RentACar.Application.Files.Dtos;
using RentACar.Application.Reservations.Dtos;

namespace RentACar.Application.Reservations.Queries.GetReservationById
{
    public record GetReservationByIdQuery(int Id) : IRequest<ReservationDto>;

    public class GetReservationByIdQueryHandler(IApplicationDbContext _context) : IRequestHandler<GetReservationByIdQuery, ReservationDto>
    {
        public async ValueTask<ReservationDto> Handle(GetReservationByIdQuery request, CancellationToken cancellationToken)
        {
            return await _context.Reservations
                .AsNoTrackingWithIdentityResolution()
                .Include(r => r.Person)
                .Include(r => r.PickupLocation)
                .Include(r => r.ReturnLocation)
                .Include(r => r.ExtraServices)
                .Include(r => r.Invoices)
                .Where(r => r.Person != null && r.Id == request.Id)
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
                .FirstOrDefaultAsync(cancellationToken: cancellationToken) ?? throw new ArgumentException("Ne valja id");
        }
    }
}
