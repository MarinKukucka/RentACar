using RentACar.Domain.Common;
using System.ComponentModel.DataAnnotations;

namespace RentACar.Domain.Entities
{
    public class Model : BaseEntity
    {
        [StringLength(50)]
        public required string Name { get; set; }


        public int? BrandId { get; set; }
        
        public virtual Brand? Brand { get; set; }

        public int? FileId { get; set; }

        public virtual File? File { get; set; }
    }
}
