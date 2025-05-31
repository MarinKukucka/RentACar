namespace RentACar.Application.Models.Dtos
{
    public class ModelDto
    {
        public int Id { get; set; }

        public required string BrandName { get; set; }

        public required string ModelName { get; set; }

        public string? Image { get; set; }
    }
}
