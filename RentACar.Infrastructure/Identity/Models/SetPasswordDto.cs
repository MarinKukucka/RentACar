namespace RentACar.Infrastructure.Identity.Models
{
    public class SetPasswordDto
    {
        public string Email { get; set; } = string.Empty;

        public string Token { get; set; } = string.Empty;

        public string Password { get; set; } = string.Empty;
    }
}
