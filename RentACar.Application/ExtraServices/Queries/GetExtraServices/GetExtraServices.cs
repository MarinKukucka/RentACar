using Mediator;
using Microsoft.EntityFrameworkCore;
using RentACar.Application.Common.Interfaces;
using RentACar.Application.ExtraServices.Dtos;

namespace RentACar.Application.ExtraServices.Queries.GetExtraServices
{
    public record GetExtraServicesQuery : IRequest<List<ExtraServiceDto>>;

    public class GetExtraServicesQueryHandler(IApplicationDbContext _context) : IRequestHandler<GetExtraServicesQuery, List<ExtraServiceDto>>
    {
        public async ValueTask<List<ExtraServiceDto>> Handle(GetExtraServicesQuery request, CancellationToken cancellationToken)
        {
            return await _context.ExtraServices
                .AsNoTrackingWithIdentityResolution()
                .ProjectToType<ExtraServiceDto>()
                .ToListAsync(cancellationToken);
        }
    }
}
