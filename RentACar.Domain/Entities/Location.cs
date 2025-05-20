using RentACar.Domain.Common;
using System.ComponentModel.DataAnnotations;

namespace RentACar.Domain.Entities
{
    public class Location : BaseEntity
    {
        [StringLength(50)]
        public required string Name { get; set; }

        [StringLength(50)]
        public required string Address { get; set; }

        [StringLength(50)]
        public required string PhoneNumber { get; set; }


        public int? CityId { get; set; }

        public City? City { get; set; }
    }
}
