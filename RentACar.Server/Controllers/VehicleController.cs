using Microsoft.AspNetCore.Http.HttpResults;
using Microsoft.AspNetCore.Mvc;
using RentACar.Application.Common.Models.Pagination;
using RentACar.Application.Vehicles.Commands.CreateVehicle;
using RentACar.Application.Vehicles.Commands.DeleteVehicle;
using RentACar.Application.Vehicles.Dtos;
using RentACar.Application.Vehicles.Queries.GetPaginatedVehicles;
using RentACar.Application.Vehicles.Queries.GetSearchResultVehicles;
using RentACar.Application.Vehicles.Queries.GetSimpleVehicles;
using RentACar.Application.Vehicles.Queries.GetVehicleById;

namespace RentACar.Server.Controllers
{
    public class VehicleController(IMediator mediator) : ApiController
    {
        [HttpGet("paginated")]
        [ProducesResponseType(typeof(PaginationResponse<VehicleDto>), StatusCodes.Status200OK)]
        public async Task<Results<Ok<PaginationResponse<VehicleDto>>, ValidationProblem>> GetPaginatedVehicles([FromQuery] GetPaginatedVehiclesQuery query)
        {
            var result = await mediator.Send(query);
            return TypedResults.Ok(result);
        }

        [HttpGet("simple")]
        [ProducesResponseType(typeof(List<SimpleVehicleDto>), StatusCodes.Status200OK)]
        public async Task<List<SimpleVehicleDto>> GetSimpleVehicles()
        {
            return await mediator.Send(new GetSimpleVehiclesQuery());
        }

        [HttpGet("searchResult")]
        [ProducesResponseType(typeof(List<VehicleDto>), StatusCodes.Status200OK)]
        public async Task<List<VehicleDto>> GetSearchResultVehicles([FromQuery] GetSearchResultVehiclesQuery query)
        {
            return await mediator.Send(query);
        }

        [HttpGet("{id}")]
        [ProducesResponseType(typeof(VehicleDto), StatusCodes.Status200OK)]
        public async Task<VehicleDto> GetVehicleById(int id)
        {
            return await mediator.Send(new GetVehicleByIdQuery(id));
        }

        [HttpPost]
        [ProducesResponseType(StatusCodes.Status204NoContent)]
        [ProducesResponseType(StatusCodes.Status400BadRequest)]
        public async Task<NoContent> CreateVehicle([FromBody] CreateVehicleCommand command)
        {
            await mediator.Send(command);
            return TypedResults.NoContent();
        }

        [HttpDelete("{id}")]
        [ProducesResponseType(StatusCodes.Status204NoContent)]
        public async Task<NoContent> DeleteVehicle(int id)
        {
            await mediator.Send(new DeleteVehicleCommand(id));
            return TypedResults.NoContent();
        }
    }
}
