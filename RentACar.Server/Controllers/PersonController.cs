using Microsoft.AspNetCore.Http.HttpResults;
using Microsoft.AspNetCore.Mvc;
using RentACar.Application.Common.Models.Pagination;
using RentACar.Application.People.Commands.CreateUserAndPerson;
using RentACar.Application.People.Commands.DeactivatePerson;
using RentACar.Application.People.Dtos;
using RentACar.Application.People.Queries.GetPaginatedPeople;

namespace RentACar.Server.Controllers
{
    public class PersonController(IMediator mediator) : ApiController
    {
        [HttpGet("people")]
        [ProducesResponseType(typeof(PaginationResponse<PersonDto>), StatusCodes.Status200OK)]
        [ProducesResponseType(StatusCodes.Status400BadRequest)]
        public async Task<Results<Ok<PaginationResponse<PersonDto>>, ValidationProblem>> GetPaginatedPeople([FromQuery] GetPaginatedPeopleQuery query)
        {
            var result = await mediator.Send(query);
            return TypedResults.Ok(result);
        }

        [HttpPost]
        [ProducesResponseType(StatusCodes.Status204NoContent)]
        [ProducesResponseType(StatusCodes.Status400BadRequest)]
        public async Task<Results<NoContent, ValidationProblem>> CreateUserAndPerson([FromBody] CreateUserAndPersonCommand command)
        {
            await mediator.Send(command);
            return TypedResults.NoContent();
        }

        [HttpPut("deactivate/{id}")]
        [ProducesResponseType(StatusCodes.Status204NoContent)]
        [ProducesResponseType(StatusCodes.Status400BadRequest)]
        public async Task<Results<NoContent, ValidationProblem>> DisablePerson([FromRoute] int id)
        {
            await mediator.Send(new DeactivatePersonCommand { PersonId = id });
            return TypedResults.NoContent();
        }
    }
}
