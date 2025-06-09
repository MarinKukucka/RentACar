using RentACar.Domain.Common;
using System.ComponentModel.DataAnnotations;

namespace RentACar.Domain.Entities
{
    public class File : BaseEntity
    {
        [StringLength(500)]
        public required string Path { get; set; }

        [StringLength(500)]
        public required string Name { get; set; }


        public virtual List<Rental>? Rentals { get; set; }
    }
}
