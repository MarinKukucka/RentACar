using Microsoft.AspNetCore.Http.HttpResults;
using Microsoft.AspNetCore.Mvc;
using RentACar.Application.Reservations.Commands.CreateReservation;
using RentACar.Application.Reservations.Commands.UpdateReservation;

namespace RentACar.Server.Controllers
{
    public class ReservationController(IMediator mediator) : ApiController
    {
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
