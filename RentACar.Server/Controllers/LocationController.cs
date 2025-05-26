using Microsoft.AspNetCore.Mvc;
using RentACar.Application.Common.Models;
using RentACar.Application.Locations.Dtos;
using RentACar.Application.Locations.Queries.GetLocationOptions;
using RentACar.Application.Locations.Queries.GetLocations;

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

        [HttpGet]
        [ProducesResponseType(typeof(List<LocationDto>), StatusCodes.Status200OK)]
        public async Task<List<LocationDto>> GetLocations()
        {
            return await mediator.Send(new GetLocationsQuery());
        }
    }
}
