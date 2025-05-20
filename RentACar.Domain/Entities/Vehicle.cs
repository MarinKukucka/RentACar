using RentACar.Domain.Common;
using RentACar.Domain.Enums;
using System.ComponentModel.DataAnnotations;

namespace RentACar.Domain.Entities
{
    public class Vehicle : BaseEntity
    {
        [StringLength(17)]
        public required string VIN { get; set; }

        [StringLength(50)]
        public required string LicensePlate { get; set; }

        public int Year { get; set; }

        public int Mileage { get; set; }

        public VehicleType VehicleType { get; set; }

        public Transmission Transmission { get; set; }

        public FuelType FuelType { get; set; }

        public int Power { get; set; }

        public int Seats { get; set; }

        public bool IsAvailable { get; set; }


        public int? ModelId { get; set; }
        
        public Model? Model { get; set; }

        public int? LocationId { get; set; }

        public Location? Location { get; set; }
    }
}
