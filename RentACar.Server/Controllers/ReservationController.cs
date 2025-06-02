using Microsoft.AspNetCore.Http.HttpResults;
using Microsoft.AspNetCore.Mvc;
using RentACar.Application.Common.Models.Pagination;
using RentACar.Application.Reservations.Commands.CreateReservation;
using RentACar.Application.Reservations.Commands.UpdateReservation;
using RentACar.Application.Reservations.Dtos;
using RentACar.Application.Reservations.Queries.GetPaginatedReservation;

namespace RentACar.Server.Controllers
{
    public class ReservationController(IMediator mediator) : ApiController
    {
        [HttpGet("paginated")]
        [ProducesResponseType(typeof(PaginationResponse<ReservationDto>), StatusCodes.Status200OK)]
        public async Task<Results<Ok<PaginationResponse<ReservationDto>>, ValidationProblem>> GetPaginatedReservations([FromQuery] GetPaginatedReservationQuery query)
        {
            var result = await mediator.Send(query);
            return TypedResults.Ok(result);
        }

        [HttpPost]
        [ProducesResponseType(typeof(int), StatusCodes.Status200OK)]
        public async Task<int> CreateReservation([FromBody] CreateReservationCommand command)
        {
            return await mediator.Send(command); 
        }

        [HttpPut]
        [ProducesResponseType(typeof(NoContent), StatusCodes.Status200OK)]
        public async Task<NoContent> UpdateReservation([FromBody] UpdateReservationCommand command)
        {
            await mediator.Send(command);

            return TypedResults.NoContent();
        }
    }
}
