using Microsoft.AspNetCore.Mvc;
using RentACar.Application.ExtraServices.Queries.GetExtraServices;
using RentACar.Application.ExtraServices.Dtos;

namespace RentACar.Server.Controllers
{
    public class ExtraServiceController(IMediator mediator) : ApiController
    {
        [HttpGet]
        [ProducesResponseType(typeof(List<ExtraServiceDto>), StatusCodes.Status200OK)]
        public async Task<List<ExtraServiceDto>> GetExtraServices()
        {
            return await mediator.Send(new GetExtraServicesQuery());
        }
    }
}
