using RentACar.Domain.Common;
using RentACar.Domain.Enums;
using System.ComponentModel.DataAnnotations;

namespace RentACar.Domain.Entities
{
    public class Rental : BaseEntity
    {
        public required RentalStatus Status { get; set; }

        public required DateTime PickupDateTime { get; set; }

        public DateTime? ReturnDateTime { get; set; }

        public required int OdometerStart { get; set; }

        public int? OdometerEnd { get; set; }

        public decimal? TotalPrice { get; set; }

        [StringLength(500)]
        public string? Notes { get; set; }


        public int? ReservationId { get; set; }

        public Reservation? Reservation { get; set; }
    }
}
