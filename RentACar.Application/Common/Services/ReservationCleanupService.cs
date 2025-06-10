using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.DependencyInjection;
using Microsoft.Extensions.Hosting;
using RentACar.Application.Common.Interfaces;
using RentACar.Domain.Enums;

namespace RentACar.Application.Common.Services
{
    public class ReservationCleanupService(IServiceProvider _serviceProvider) : BackgroundService
    {
        protected override async Task ExecuteAsync(CancellationToken stoppingToken)
        {
            while (!stoppingToken.IsCancellationRequested)
            {
                using (var scope = _serviceProvider.CreateScope())
                {
                    var context = scope.ServiceProvider.GetRequiredService<IApplicationDbContext>();

                    var today = DateTime.Today;

                    var expiredReservations = await context.Reservations
                        .Where(r =>
                            (r.Status == ReservationStatus.Pending || r.Status == ReservationStatus.Confirmed) &&
                            r.StartDateTime.Date < today)
                        .ToListAsync(stoppingToken);

                    foreach (var reservation in expiredReservations)
                    {
                        reservation.Status = ReservationStatus.Cancelled;
                        reservation.CancelledAt = DateTime.Now;
                    }

                    await context.SaveChangesAsync(stoppingToken);
                }

                await Task.Delay(TimeSpan.FromSeconds(300), stoppingToken);
            }
        }
    }
}
