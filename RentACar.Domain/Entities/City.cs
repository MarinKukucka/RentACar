using RentACar.Domain.Common;
using System.ComponentModel.DataAnnotations;

namespace RentACar.Domain.Entities
{
    public class City : BaseEntity
    {
        [StringLength(100)]
        public required string Name { get; set; }

        [StringLength(5)]
        public required string PostalCode { get; set; }
    }
}
