namespace RentACar.Application.Files.Dtos
{
    public class FileDto
    {
        public int Id { get; set; }

        public required string Name { get; set; }

        public required string Path { get; set; }
    }
}
