using Microsoft.AspNetCore.Http.HttpResults;
using Microsoft.AspNetCore.Mvc;
using RentACar.Application.Common.Models.Pagination;
using RentACar.Application.Vehicles.Commands.CreateVehicle;
using RentACar.Application.Vehicles.Commands.DeleteVehicle;
using RentACar.Application.Vehicles.Dtos;
using RentACar.Application.Vehicles.Queries.GetPaginatedVehicles;

namespace RentACar.Server.Controllers
{
    public class VehicleController(IMediator mediator) : ApiController
    {
        [HttpGet]
        [ProducesResponseType(typeof(PaginationResponse<VehicleDto>), StatusCodes.Status200OK)]
        public async Task<Results<Ok<PaginationResponse<VehicleDto>>, ValidationProblem>> GetPaginatedVehicles([FromQuery] GetPaginatedVehiclesQuery query)
        {
            var result = await mediator.Send(query);
            return TypedResults.Ok(result);
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
