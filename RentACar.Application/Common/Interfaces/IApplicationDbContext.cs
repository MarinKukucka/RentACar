﻿using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Storage;
using RentACar.Domain.Entities;
using File = RentACar.Domain.Entities.File;

namespace RentACar.Application.Common.Interfaces
{
    public interface IApplicationDbContext
    {
        DbSet<Person> People { get; }

        DbSet<File> Files { get; }

        DbSet<Brand> Brands { get; }

        DbSet<Model> Models { get; }

        DbSet<Vehicle> Vehicles { get; }

        DbSet<City> Cities { get; }

        DbSet<Location> Locations { get; }

        DbSet<Reservation> Reservations { get; }

        DbSet<ExtraService> ExtraServices { get; }

        DbSet<Rental> Rentals { get; }

        DbSet<Invoice> Invoices { get; }

        DbSet<Payment> Payments { get; }
        

        Task<int> SaveChangesAsync(CancellationToken cancellationToken);

        Task<IDbContextTransaction> BeginTransactionAsync();
    }
}
