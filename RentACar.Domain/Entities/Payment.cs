using RentACar.Domain.Common;
using RentACar.Domain.Enums;

namespace RentACar.Domain.Entities
{
    public class Payment : BaseEntity
    {
        public required decimal Amount { get; set; }

        public required PaymentType PaymentType { get; set; }

        public required DateTime CreatedAt { get; set; }

        public int StripePaymentIntentId { get; set; }

        
        public int? PersonId { get; set; }

        public Person? Person { get; set; }

        public int? ReservationId { get; set; }

        public Reservation? Reservation { get; set; }

        public int? RentalId { get; set; }

        public Rental? Rental { get; set; }

        public List<Invoice>? Invoices { get; set; }
    }
}
