namespace RentACar.Application.People.Dtos
{
    public class CreateUserDto
    {
        public int PersonId { get; set; }
        public required string Email { get; set; }
        public required string Password { get; set; }
        public string? Role { get; set; }
    }
}
