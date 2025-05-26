using RentACar.Domain.Common;
using System.ComponentModel.DataAnnotations;

namespace RentACar.Domain.Entities
{
    public class Brand : BaseEntity
    {
        [StringLength(50)]
        public required string Name { get; set; }

        public virtual List<Model>? Models { get; set; }
    }
}
