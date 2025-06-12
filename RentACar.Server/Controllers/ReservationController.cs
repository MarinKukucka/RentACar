using Microsoft.AspNetCore.Http.HttpResults;
using Microsoft.AspNetCore.Mvc;
using RentACar.Application.Common.Models.Pagination;
using RentACar.Application.Reservations.Commands.CreateReservation;
using RentACar.Application.Reservations.Commands.UpdateReservation;
using RentACar.Application.Reservations.Dtos;
using RentACar.Application.Reservations.Queries.GetPaginatedReservation;
using RentACar.Application.Reservations.Queries.GetReservationById;
using RentACar.Application.Reservations.Queries.GetTodaysReservations;

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

        [HttpGet("todaysReservations")]
        [ProducesResponseType(typeof(List<ReservationDto>), StatusCodes.Status200OK)]
        public async Task<List<ReservationDto>> GetTodaysReservations()
        {
            return await mediator.Send(new GetTodaysReservationsQuery());
        }

        [HttpGet("{id}")]
        [ProducesResponseType(typeof(ReservationDto), StatusCodes.Status200OK)]
        public async Task<ReservationDto> GetReservationById(int id)
        {
            return await mediator.Send(new GetReservationByIdQuery(id));
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
