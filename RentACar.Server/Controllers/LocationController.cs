using Microsoft.AspNetCore.Mvc;
using RentACar.Application.Common.Models;
using RentACar.Application.Locations.Queries.GetLocationOptions;

namespace RentACar.Server.Controllers
{
    public class LocationController(IMediator mediator) : ApiController
    {
        [HttpGet("options")]
        [ProducesResponseType(typeof(List<OptionsDto>), StatusCodes.Status200OK)]
        public async Task<List<OptionsDto>> GetLocationOptions()
        {
            return await mediator.Send(new GetLocationOptionsQuery());
        }
    }
}
