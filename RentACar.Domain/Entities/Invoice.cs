using RentACar.Domain.Common;
using System.ComponentModel.DataAnnotations;

namespace RentACar.Domain.Entities
{
    public class Invoice : BaseEntity
    {
        [StringLength(50)]
        public required string InvoiceNumber { get; set; }

        public required DateTime IssuedAt { get; set; }

        public decimal TotalAmount { get; set; }

        
        public int? PersonId { get; set; }

        public Person? Person { get; set; }

        public int? ReservationId { get; set; }

        public Reservation? Reservation { get; set; }

        public int? RentalId { get; set; }

        public Rental? Rental { get; set; }

        public List<Payment>? Payments { get; set; }
    }
}
