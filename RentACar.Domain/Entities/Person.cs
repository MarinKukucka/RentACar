using RentACar.Domain.Common;
using System.ComponentModel.DataAnnotations;

namespace RentACar.Domain.Entities
{
    public class Person : BaseEntity
    {
        [StringLength(50)]
        public string? FirstName { get; set; }

        [StringLength(50)] 
        public string? LastName { get; set; }

        [StringLength(50)]
        public string? PhoneNumber { get; set; }

        public bool IsActive { get; set; }


        public ApplicationUser? User { get; set; }
    }
}
