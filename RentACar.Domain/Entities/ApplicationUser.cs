using Microsoft.AspNetCore.Identity;

namespace RentACar.Domain.Entities
{
    public class ApplicationUser : IdentityUser
    {
        public int PersonId { get; set; }

        public Person? Person { get; set; }
    }
}
