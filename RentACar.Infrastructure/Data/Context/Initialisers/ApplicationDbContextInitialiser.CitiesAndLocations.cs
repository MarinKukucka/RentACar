using RentACar.Domain.Entities;

namespace RentACar.Infrastructure.Data.Context
{
    public partial class ApplicationDbContextInitialiser
    {
        public async Task SeedCitiesAndLocationsAsync()
        {
            #region Cities

            if (context.Cities.Any()) return;

            var zagrebCity = new City
            {
                Name = "Zagreb",
                PostalCode = "10000"
            };

            var varazdinCity = new City
            {
                Name = "Varaždin",
                PostalCode = "42000"
            };

            var dakovoCity = new City
            {
                Name = "Đakovo",
                PostalCode = "31400"
            };

            context.Cities.AddRange([zagrebCity, varazdinCity, dakovoCity]);

            await context.SaveChangesAsync();

            #endregion

            #region Locations

            if (context.Locations.Any()) return;

            var locations = new List<Location>()
            {
                new()
                {
                    Name = "Zagreb - Airport",
                    Address = "Ulica Rudolfa Fizira 21",
                    PhoneNumber = "01 123 456",
                    City = zagrebCity
                },
                new()
                {
                    Name = "Zagreb - Maksimir",
                    Address = "Maksimirska cesta 128",
                    PhoneNumber = "01 654 321",
                    City = zagrebCity
                },
                new()
                {
                    Name = "Varaždin - SD",
                    Address = "Ulica Petra Krešimira IV 42",
                    PhoneNumber = "042 987 654",
                    City = varazdinCity
                },
                new()
                {
                    Name = "Đakovo - Kino",
                    Address = "Ulica kralja Tomislava 8",
                    PhoneNumber = "031 456 789",
                    City =dakovoCity
                }

            };

            context.Locations.AddRange(locations);

            await context.SaveChangesAsync();

            #endregion
        }
    }
}
