namespace RentACar.Infrastructure.Identity.Models
{
    public class UserDto
    {
        public string? Id { get; set; }

        public string? Email { get; set; }

        public string? Name { get; set; }

        public IList<string>? Roles { get; set; }
    }
}
