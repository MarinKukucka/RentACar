using Microsoft.AspNetCore.Http.HttpResults;
using Microsoft.AspNetCore.Mvc;
using RentACar.Application.Rentals.Commands.CreateRental;

namespace RentACar.Server.Controllers
{
    public class RentalController(IMediator mediator) : ApiController
    {
        [HttpPost]
        [ProducesResponseType(typeof(NoContent), StatusCodes.Status200OK)]
        public async Task<NoContent> CreateRental([FromBody] CreateRentalCommand command)
        {
            await mediator.Send(command);

            return TypedResults.NoContent();
        }
    }
}
