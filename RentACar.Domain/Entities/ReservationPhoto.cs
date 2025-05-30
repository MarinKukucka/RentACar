using RentACar.Domain.Common;
using RentACar.Domain.Enums;

namespace RentACar.Domain.Entities
{
    public class ReservationPhoto : BaseEntity
    {
        public required ReservationRentalPhotoType ReservationPhotoType { get; set; }


        public int? FileId { get; set; }

        public File? File { get; set; }

        public int? ReservationId { get; set; }
        
        public Reservation? Reservation { get; set; }
    }
}
