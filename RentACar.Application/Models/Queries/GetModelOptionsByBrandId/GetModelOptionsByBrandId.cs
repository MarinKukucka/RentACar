using Mediator;
using Microsoft.EntityFrameworkCore;
using RentACar.Application.Common.Interfaces;
using RentACar.Application.Common.Models;

namespace RentACar.Application.Models.Queries.GetModelOptionsByBrandId
{
    public record GetModelOptionsByBrandIdQuery(int BrandId) : IRequest<List<OptionsDto>>;

    public class GetModelOptionsByBrandIdQueryHandler(IApplicationDbContext _context) : IRequestHandler<GetModelOptionsByBrandIdQuery, List<OptionsDto>>
    {
        public async ValueTask<List<OptionsDto>> Handle(GetModelOptionsByBrandIdQuery request, CancellationToken cancellationToken)
        {
            return await _context.Models
                .AsNoTrackingWithIdentityResolution()
                .Where(m => m.BrandId == request.BrandId)
                .ProjectToType<OptionsDto>()
                .OrderBy(m => m.Name)
                .ToListAsync(cancellationToken);
        }
    }
}
