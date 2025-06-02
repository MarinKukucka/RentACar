using RentACar.Domain.Common;
using RentACar.Domain.Enums;
using System.ComponentModel.DataAnnotations;

namespace RentACar.Domain.Entities
{
    public class Reservation : BaseEntity
    {
        public required DateTime StartDateTime { get; set; }

        public required DateTime EndDateTime { get; set; }

        public required ReservationStatus Status { get; set; }

        public DateTime? ConfirmedAt { get; set; }

        public DateTime? CancelledAt { get; set; }

        public required decimal TotalPrice { get; set; }

        [StringLength(500)]
        public string? Notes { get; set; }

        
        public int? PersonId { get; set; }

        public Person? Person { get; set; }

        public int? VehicleId { get; set; }

        public Vehicle? Vehicle { get; set; }

        public int? PickupLocationId { get; set; }

        public Location? PickupLocation { get; set; }

        public int? ReturnLocationId { get; set; }

        public Location? ReturnLocation { get; set; }

        public virtual List<ExtraService>? ExtraServices { get; set; }
    }
}
