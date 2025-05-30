using RentACar.Domain.Common;
using RentACar.Domain.Enums;

namespace RentACar.Domain.Entities
{
    public class RentalPhoto : BaseEntity
    {
        public required ReservationRentalPhotoType ReservationPhotoType { get; set; }


        public int? FileId { get; set; }

        public File? File { get; set; }

        public int? RentalId { get; set; }

        public Rental? Rental { get; set; }
    }
}
