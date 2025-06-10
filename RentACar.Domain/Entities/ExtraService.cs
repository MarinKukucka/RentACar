using RentACar.Domain.Common;
using System.ComponentModel.DataAnnotations;

namespace RentACar.Domain.Entities
{
    public class ExtraService : BaseEntity
    {
        [StringLength(100)]
        public required string Name { get; set; }

        [StringLength(500)]
        public required string Description { get; set; }

        public required decimal Price { get; set; }


        public virtual List<Reservation>? Reservations { get; set; }
    }
}
