using RentACar.Application.Models.Dtos;
using RentACar.Domain.Enums;

namespace RentACar.Application.Vehicles.Dtos
{
    public class VehicleDto
    {
        public int Id { get; set; }

        public required string VIN { get; set; }

        public required string LicensePlate { get; set; }

        public int Year { get; set; }

        public int Mileage { get; set; }

        public VehicleType VehicleType { get; set; }

        public Transmission Transmission { get; set; }

        public FuelType FuelType { get; set; }

        public int Power { get; set; }

        public int Seats { get; set; }

        public bool IsAvailable { get; set; }

        public decimal Price { get; set; }

        public ModelDto? Model { get; set; }

        public required string Location { get; set; }
    }
}
