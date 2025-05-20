using Microsoft.AspNetCore.Mvc;

namespace RentACar.Server.Controllers
{
    [ApiController]
    [ProducesResponseType(StatusCodes.Status401Unauthorized)]
    [ProducesResponseType(StatusCodes.Status403Forbidden)]
    [Route("api/[controller]")]
    public class ApiController : Controller
    {
    }
}
