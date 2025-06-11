using Microsoft.AspNetCore.Http.HttpResults;
using Microsoft.AspNetCore.Mvc;
using RentACar.Application.Common.Models.Pagination;
using RentACar.Application.Rentals.Commands.CreateRental;
using RentACar.Application.Rentals.Commands.FinishRental;
using RentACar.Application.Rentals.Dtos;
using RentACar.Application.Rentals.Queries.GetPaginatedRentals;
using RentACar.Application.Rentals.Queries.GetTodaysRentals;

namespace RentACar.Server.Controllers
{
    public class RentalController(IMediator mediator) : ApiController
    {
        [HttpGet]
        [ProducesResponseType(typeof(PaginationResponse<RentalDto>), StatusCodes.Status200OK)]
        public async Task<Results<Ok<PaginationResponse<RentalDto>>, ValidationProblem>> GetPaginatedVehicles([FromQuery] GetPaginatedRentalsQuery query)
        {
            var result = await mediator.Send(query);
            return TypedResults.Ok(result);
        }

        [HttpGet("todaysRentals")]
        [ProducesResponseType(typeof(List<RentalDto>), StatusCodes.Status200OK)]
        public async Task<List<RentalDto>> GetTodaysRentals()
        {
            return await mediator.Send(new GetTodaysRentalsQuery());
        }

        [HttpPost("create-rental")]
        [ProducesResponseType(typeof(NoContent), StatusCodes.Status200OK)]
        public async Task<NoContent> CreateRental([FromBody] CreateRentalCommand command)
        {
            await mediator.Send(command);

            return TypedResults.NoContent();
        }

        [HttpPost("finish-rental")]
        [ProducesResponseType(typeof(NoContent), StatusCodes.Status200OK)]
        public async Task<NoContent> FinishRental([FromForm] FinishRentalCommand command)
        {
            await mediator.Send(command);

            return TypedResults.NoContent();
        }
    }
}
