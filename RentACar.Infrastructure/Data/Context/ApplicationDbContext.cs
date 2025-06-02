using Microsoft.AspNetCore.Identity.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Storage;
using RentACar.Application.Common.Interfaces;
using RentACar.Domain.Entities;
using File = RentACar.Domain.Entities.File;

namespace RentACar.Infrastructure.Data.Context
{
    public class ApplicationDbContext : IdentityDbContext<ApplicationUser>, IApplicationDbContext
    {
        public ApplicationDbContext(DbContextOptions<ApplicationDbContext> options)
            : base(options)
        {
        }

        public ApplicationDbContext()
        {
        }

        public DbSet<Person> People => Set<Person>();

        public DbSet<File> Files => Set<File>();

        public DbSet<Brand> Brands => Set<Brand>();

        public DbSet<Model> Models => Set<Model>();

        public DbSet<Vehicle> Vehicles => Set<Vehicle>();

        public DbSet<City> Cities => Set<City>();

        public DbSet<Location> Locations => Set<Location>();

        public DbSet<Reservation> Reservations => Set<Reservation>();

        public DbSet<ExtraService> ExtraServices => Set<ExtraService>();

        public DbSet<ReservationPhoto> ReservationPhotos => Set<ReservationPhoto>();

        public DbSet<Rental> Rentals => Set<Rental>();

        public DbSet<RentalPhoto> RentalPhotos => Set<RentalPhoto>();

        public DbSet<Invoice> Invoices => Set<Invoice>();

        public DbSet<Payment> Payments => Set<Payment>();

        protected override void OnConfiguring(DbContextOptionsBuilder optionsBuilder)
        {
            if (!optionsBuilder.IsConfigured)
            {
                var cs = "Server=(localdb)\\mssqllocaldb;Database=RentACar;Trusted_Connection=True;";
                optionsBuilder.UseSqlServer(cs);
            }
        }

        public async Task<IDbContextTransaction> BeginTransactionAsync()
        {
            return await Database.BeginTransactionAsync();
        }
    }
}
