using Mediator;
using Microsoft.AspNetCore.Http;
using Microsoft.EntityFrameworkCore;
using RentACar.Application.Common.Interfaces;
using RentACar.Domain.Entities;
using RentACar.Domain.Enums;
using File = RentACar.Domain.Entities.File;

namespace RentACar.Application.Rentals.Commands.FinishRental
{
    public record FinishRentalCommand : IRequest
    {
        public required int Id { get; set; }

        public required DateTime ReturnDateTime { get; set; }

        public required int OdometerEnd { get; set; }

        public string? Notes { get; set; }

        public List<IFormFile>? Files { get; set; }
    }

    public class FinishRentalCommandHandler(IApplicationDbContext _context, IFileService _fileService) : IRequestHandler<FinishRentalCommand>
    {
        public async ValueTask<Unit> Handle(FinishRentalCommand request, CancellationToken cancellationToken)
        {
            var entity = await _context.Rentals
                .Include(r => r.Reservation)
                    .ThenInclude(r => r!.Vehicle)
                .Where(r => r.Reservation != null && r.Reservation.Vehicle != null)
                .FirstOrDefaultAsync(r => r.Id == request.Id, cancellationToken) ?? throw new ArgumentException("Ne valja");
            
            var photoFiles = new List<File>();
            if (request.Files is not null)
            {
                foreach (var file in request.Files)
                {
                    var allowedExtensions = new[] { ".jpg", ".jpeg", ".png" };

                    var filePath = await _fileService.SaveFileAsync(file, allowedExtensions);

                    photoFiles.Add(new File
                    {
                        Name = file.FileName,
                        Path = filePath
                    });
                }
            }

            request.Adapt(entity);

            entity.Files = photoFiles;
            entity.Status = RentalStatus.Returned;

            entity.Reservation.Status = ReservationStatus.Completed;
            entity.Reservation!.Vehicle!.LocationId = entity.Reservation.ReturnLocationId;

            await _context.SaveChangesAsync(cancellationToken);

            return Unit.Value;
        }
    }
}
