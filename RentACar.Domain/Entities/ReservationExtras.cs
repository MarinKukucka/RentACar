using RentACar.Domain.Common;

namespace RentACar.Domain.Entities
{
    public class ReservationExtras : BaseEntity
    {
        public required int Quantity { get; set; }

        public required decimal TotalPrice { get; set; }

        
        public int? ExtraServiceId { get; set; }

        public ExtraService? ExtraService { get; set; }

        public int? ReservationId { get; set; }

        public Reservation? Reservation { get; set; }
    }
}
