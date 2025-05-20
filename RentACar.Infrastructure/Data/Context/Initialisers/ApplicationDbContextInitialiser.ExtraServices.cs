using RentACar.Domain.Entities;

namespace RentACar.Infrastructure.Data.Context
{
    public partial class ApplicationDbContextInitialiser
    {
        public async Task SeedExtraServicesAsync()
        {
            if (context.ExtraServices.Any()) return;

            var extraServices = new List<ExtraService>()
            {
                new()
                {
                    Name = "Additional driver",
                    Description = "Only people added as additional drivers may drive the rental vehicle in addition to the renter. Each additional driver must present a valid driver's license at vehicle pickup.",
                    Price = 8.75M
                },
                new()
                {
                    Name = "Theft protection",
                    Description = "Nije problem ako zuca zuji da trepne neće securityui",
                    Price = 10.00M
                },
                new()
                {
                    Name = "Tire and Windshield Protection",
                    Description = "CapCaRap assumes liability for any window and tire damage.",
                    Price = 5.00M
                },
                new()
                {
                    Name = "Interior Protection",
                    Description = "Coverage if the vehicle's interior is damaged, dirty or messy.",
                    Price = 3.75M
                },
                new()
                {
                    Name = "Infant seat",
                    Description = "These car seats are for babies up to 1 year old and weigh up to 13 kg.",
                    Price = 7.00M
                },
                new()
                {
                    Name = "Child seat",
                    Description = "These car seats are for children who are between 1 and 4 years old and weigh up to 20 kg.",
                    Price = 7.00M
                }
            };

            context.ExtraServices.AddRange(extraServices);

            await context.SaveChangesAsync();
        }
    }
}
