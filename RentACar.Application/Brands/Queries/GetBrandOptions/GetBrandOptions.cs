using Mediator;
using Microsoft.EntityFrameworkCore;
using RentACar.Application.Common.Interfaces;
using RentACar.Application.Common.Models;

namespace RentACar.Application.Brands.Queries.GetBrandOptions
{
    public record GetBrandOptionsQuery : IRequest<List<OptionsDto>>;

    public class GetBrandOptionsQueryHandler(IApplicationDbContext _context) : IRequestHandler<GetBrandOptionsQuery, List<OptionsDto>>
    {
        public async ValueTask<List<OptionsDto>> Handle(GetBrandOptionsQuery request, CancellationToken cancellationToken)
        {
            return await _context.Brands
                .AsNoTrackingWithIdentityResolution()
                .ProjectToType<OptionsDto>()
                .OrderBy(b => b.Name)
                .ToListAsync(cancellationToken);
        }
    }
}
