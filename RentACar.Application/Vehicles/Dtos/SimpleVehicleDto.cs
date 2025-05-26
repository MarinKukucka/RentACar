namespace RentACar.Application.Vehicles.Dtos
{
    public class SimpleVehicleDto
    {
        public int Id { get; set; }

        public required string Name { get; set; }

        public string? Image { get; set; }

        public decimal Price { get; set; }
    }
}
