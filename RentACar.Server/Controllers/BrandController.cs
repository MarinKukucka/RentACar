using Microsoft.AspNetCore.Mvc;
using RentACar.Application.Brands.Queries.GetBrandOptions;
using RentACar.Application.Common.Models;

namespace RentACar.Server.Controllers
{
    public class BrandController(IMediator mediator) : ApiController
    {
        [HttpGet("options")]
        [ProducesResponseType(typeof(List<OptionsDto>), StatusCodes.Status200OK)]
        public async Task<List<OptionsDto>> GetBrandOptions()
        {
            return await mediator.Send(new GetBrandOptionsQuery());
        }
    }
}
