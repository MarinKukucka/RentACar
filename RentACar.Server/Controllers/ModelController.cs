using Microsoft.AspNetCore.Mvc;
using RentACar.Application.Common.Models;
using RentACar.Application.Models.Queries.GetModelOptionsByBrandId;

namespace RentACar.Server.Controllers
{
    public class ModelController(IMediator mediator) : ApiController
    {
        [HttpGet("options/{brandId}")]
        [ProducesResponseType(typeof(List<OptionsDto>), StatusCodes.Status200OK)]
        public async Task<List<OptionsDto>> GetModelOptionsByBrandId(int brandId)
        {
            return await mediator.Send(new GetModelOptionsByBrandIdQuery(brandId));
        }
    }
}
