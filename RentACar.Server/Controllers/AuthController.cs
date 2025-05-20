using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using RentACar.Infrastructure.Identity.Models;
using RentACar.Infrastructure.Services;

namespace RentACar.Server.Controllers
{
    public class AuthController(IAuthService _auth) : ApiController
    {
        [HttpPost("login")]
        public async Task<IActionResult> Login(LoginDto dto)
        {
            var result = await _auth.PasswordSignInAsync(dto.Email, dto.Password, true);
            if (!result.Succeeded) return Unauthorized();
            return Ok();
        }

        [HttpPost("logout"), Authorize]
        public async Task<IActionResult> Logout()
        {
            await _auth.SignOutAsync();
            return NoContent();
        }

        [HttpGet("me"), Authorize]
        [ProducesResponseType(typeof(UserDto), StatusCodes.Status200OK)]
        public async Task<UserDto> Me()
        {
            var user = await _auth.GetCurrentUserAsync(HttpContext);
            var roles = user == null
                ? Array.Empty<string>()
                : await _auth.GetUserRolesAsync(user);

            return new UserDto
            {
                Id = user?.Id,
                Email = user?.Email,
                Name = user?.UserName,
                Roles = roles
            };
        }
    }
}
