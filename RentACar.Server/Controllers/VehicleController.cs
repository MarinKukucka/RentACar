using Microsoft.AspNetCore.Http.HttpResults;
using Microsoft.AspNetCore.Mvc;
using RentACar.Application.Common.Models.Pagination;
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

        [HttpDelete("{id}")]
        [ProducesResponseType(StatusCodes.Status204NoContent)]
        public async Task<NoContent> DeleteVehicle(int id)
        {
            await mediator.Send(new DeleteVehicleCommand(id));
            return TypedResults.NoContent();
        }
    }
}
