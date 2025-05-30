using RentACar.Domain.Entities;
using System.Text.Json;

namespace RentACar.Infrastructure.Data.Context
{
    public class BrandSeed
    {
        public string Name { get; set; } = default!;
        public List<ModelSeed> Models { get; set; } = [];
    }

    public class ModelSeed
    {
        public string Name { get; set; } = default!;
        public FileSeed File { get; set; } = default!;
    }

    public class FileSeed
    {
        public string Name { get; set; } = default!;
    }


    public partial class ApplicationDbContextInitialiser
    {
        public async Task SeedBrandsAndModelsAsync()
        {
            if (context.Brands.Any()) return;

            string baseDir = AppContext.BaseDirectory;
            string seedJson = Path.Combine(baseDir, "Data", "SeedData", "seedBrandsAndModels.json");
            string imagesRoot = Path.Combine(baseDir, "Data", "SeedData", "images", "brandAndModels");

            var json = await System.IO.File.ReadAllTextAsync(seedJson);
            var brandSeeds = JsonSerializer.Deserialize<List<BrandSeed>>(json)!;

            foreach (var brandSeed in brandSeeds)
            {
                var brand = new Brand { Name = brandSeed.Name };
                context.Brands.Add(brand);
                await context.SaveChangesAsync();

                foreach (var modelSeed in brandSeed.Models)
                {
                    var imagePath = Path.Combine(imagesRoot, brandSeed.Name.ToLower().Replace(" ", "-"), modelSeed.File.Name);

                    var relativePath = fileService.SeedFile(imagePath);

                    var file = new Domain.Entities.File
                    {
                        Name = modelSeed.File.Name,
                        Path = relativePath
                    };
                    context.Files.Add(file);
                    await context.SaveChangesAsync();

                    var model = new Model
                    {
                        Name = modelSeed.Name,
                        BrandId = brand.Id,
                        FileId = file.Id
                    };

                    context.Models.Add(model);
                }

                await context.SaveChangesAsync();
            }
        }
    }
}
