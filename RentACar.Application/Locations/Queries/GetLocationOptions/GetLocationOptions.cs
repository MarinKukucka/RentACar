using Mediator;
using Microsoft.EntityFrameworkCore;
using RentACar.Application.Common.Interfaces;
using RentACar.Application.Common.Models;

namespace RentACar.Application.Locations.Queries.GetLocationOptions
{
    public record GetLocationOptionsQuery : IRequest<List<OptionsDto>>;

    public class GetLocationOptionsQueryHandler(IApplicationDbContext _context) : IRequestHandler<GetLocationOptionsQuery, List<OptionsDto>>
    {
        public async ValueTask<List<OptionsDto>> Handle(GetLocationOptionsQuery request, CancellationToken cancellationToken)
        {
            return await _context.Locations
                .AsNoTrackingWithIdentityResolution()
                .ProjectToType<OptionsDto>()
                .ToListAsync(cancellationToken);
        }
    }
}
