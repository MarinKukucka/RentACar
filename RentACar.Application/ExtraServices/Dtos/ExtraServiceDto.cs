namespace RentACar.Application.ExtraServices.Dtos
{
    public class ExtraServiceDto
    {
        public int Id { get; set; }

        public required string Name { get; set; }

        public required string Description { get; set; }

        public required decimal Price { get; set; }
    }
}
