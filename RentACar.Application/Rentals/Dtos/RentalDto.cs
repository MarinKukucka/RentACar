using RentACar.Domain.Enums;
using System.ComponentModel.DataAnnotations;

namespace RentACar.Application.Rentals.Dtos
{
    public class RentalDto
    {
        public int Id { get; set; }

        public required RentalStatus Status { get; set; }

        public required DateTime PickupDateTime { get; set; }

        public DateTime? ReturnDateTime { get; set; }

        public required int OdometerStart { get; set; }

        public int? OdometerEnd { get; set; }

        public decimal? TotalPrice { get; set; }

        [StringLength(500)]
        public string? Notes { get; set; }
    }
}
