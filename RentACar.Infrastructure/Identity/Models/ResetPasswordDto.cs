using System.ComponentModel.DataAnnotations;

namespace RentACar.Infrastructure.Identity.Models
{
    public class ResetPasswordDto
    {
        [Required] public string UserId { get; set; } = default!;
        [Required] public string Token { get; set; } = default!;
        [Required] public string NewPassword { get; set; } = default!;
    }
}