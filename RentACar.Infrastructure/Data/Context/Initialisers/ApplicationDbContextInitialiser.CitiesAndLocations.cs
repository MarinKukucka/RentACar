using Microsoft.EntityFrameworkCore;
using RentACar.Domain.Entities;
using System.Text.Json;

namespace RentACar.Infrastructure.Data.Context
{
    public class LocationSeed
    {
        public string Name { get; set; } = default!;
        public string Address { get; set; } = default!;
        public string PhoneNumber { get; set; } = default!;
        public string CityName { get; set; } = default!;
        public FileSeed? File { get; set; } 
    }


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

            string baseDir = AppContext.BaseDirectory;
            string seedJson = Path.Combine(baseDir, "Data", "SeedData", "seedLocations.json");
            string imagesRoot = Path.Combine(baseDir, "Data", "SeedData", "images", "locations");

            var json = await System.IO.File.ReadAllTextAsync(seedJson);
            var locationSeeds = JsonSerializer.Deserialize<List<LocationSeed>>(json)!;

            foreach (var seed in locationSeeds)
            {
                var city = await context.Cities.FirstOrDefaultAsync(c => c.Name == seed.CityName);
                if (city == null) continue;

                int? fileId = null;

                if (seed.File != null)
                {
                    var imagePath = Path.Combine(imagesRoot, seed.File.Name);
                    var relativePath = fileService.SeedFile(imagePath);

                    var file = new Domain.Entities.File
                    {
                        Name = seed.File.Name,
                        Path = relativePath
                    };

                    context.Files.Add(file);
                    await context.SaveChangesAsync();

                    fileId = file.Id;
                }

                var location = new Location
                {
                    Name = seed.Name,
                    Address = seed.Address,
                    PhoneNumber = seed.PhoneNumber,
                    CityId = city.Id,
                    FileId = fileId
                };

                context.Locations.Add(location);
            }

            await context.SaveChangesAsync();

            #endregion
        }
    }
}
