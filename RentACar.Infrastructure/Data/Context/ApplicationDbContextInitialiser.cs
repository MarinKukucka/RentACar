using Microsoft.AspNetCore.Builder;
using Microsoft.AspNetCore.Identity;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.DependencyInjection;
using Microsoft.Extensions.Logging;
using RentACar.Application.Common.Interfaces;
using RentACar.Domain.Constants;
using RentACar.Domain.Entities;

namespace RentACar.Infrastructure.Data.Context
{
    public static class InitialiserExtensions
    {
        public static async Task InitialiseDatabaseAsync(this WebApplication app)
        {
            using var scope = app.Services.CreateScope();
            var initialiser = scope.ServiceProvider
                                   .GetRequiredService<ApplicationDbContextInitialiser>();

            await initialiser.InitialiseAsync();
            await initialiser.SeedAsync();
        }
    }
        
    public partial class ApplicationDbContextInitialiser(
        ILogger<ApplicationDbContextInitialiser> logger,
        ApplicationDbContext context,
        UserManager<ApplicationUser> userManager,
        RoleManager<IdentityRole> roleManager,
        IFileService fileService)
    {
        public async Task InitialiseAsync()
        {
            try
            {
                await context.Database.MigrateAsync();
            }
            catch (Exception ex)
            {
                logger.LogError(ex, "Error migrating database.");
                throw;
            }
        }

        public async Task SeedAsync()
        {
            try
            {
                await TrySeedAsync();
            }
            catch (Exception ex)
            {
                logger.LogError(ex, "Error seeding database.");
                throw;
            }
        }

        private async Task TrySeedAsync()
        {
            await SeedBrandsAndModelsAsync();

            await SeedCitiesAndLocationsAsync();

            await SeedExtraServicesAsync();

            #region auth

            // 1) Seed roles
            foreach (var roleName in Roles.All)  // Roles.All comes from your Domain.Constants.Roles
            {
                if (!await roleManager.RoleExistsAsync(roleName))
                    await roleManager.CreateAsync(new IdentityRole(roleName));
            }

            // 2) Seed the initial admin user *once*
            var email = "admin@rentacar.com";
            var password = "Dinamo123!";
            if (string.IsNullOrWhiteSpace(email) || string.IsNullOrWhiteSpace(password))
                return;

            var admin = await userManager.FindByEmailAsync(email);
            if (admin == null)
            {
                // Create the Person record first, if you need PersonId linkage
                var person = new Person
                {
                    FirstName = "Admin",
                    LastName = "User",
                    IsActive = true
                };
                context.People.Add(person);
                await context.SaveChangesAsync();

                // Now create the ApplicationUser
                admin = new ApplicationUser
                {
                    UserName = "admin@rentacar.com",
                    Email = email,
                    EmailConfirmed = true,
                    PersonId = person.Id
                };
                var result = await userManager.CreateAsync(admin, password);
                if (result.Succeeded)
                {
                    await userManager.AddToRoleAsync(admin, Roles.Admin);
                }
            }

            #endregion
        }
    }
}