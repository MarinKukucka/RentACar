using Mediator;
using Microsoft.EntityFrameworkCore;
using RentACar.Application.Common.Interfaces;
using RentACar.Application.Rentals.Dtos;

namespace RentACar.Application.Rentals.Queries.GetRentalById
{
    public record GetRentalByIdQuery(int Id) : IRequest<RentalDto>;

    public class GetRentalByIdQueryHandler(IApplicationDbContext _context) : IRequestHandler<GetRentalByIdQuery, RentalDto>
    {
        public async ValueTask<RentalDto> Handle(GetRentalByIdQuery request, CancellationToken cancellationToken)
        {
            return await _context.Rentals
                .AsNoTrackingWithIdentityResolution()
                .Where(r => r.Id == request.Id)
                .ProjectToType<RentalDto>()
                .FirstOrDefaultAsync(cancellationToken) ?? throw new ArgumentException("Id ne valja");
        }
    }
}
