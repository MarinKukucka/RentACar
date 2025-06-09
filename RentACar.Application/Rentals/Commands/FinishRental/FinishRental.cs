using Mediator;
using Microsoft.AspNetCore.Http;
using RentACar.Application.Common.Interfaces;
using RentACar.Domain.Entities;
using RentACar.Domain.Enums;
using Stripe;
using File = RentACar.Domain.Entities.File;

namespace RentACar.Application.Rentals.Commands.FinishRental
{
    public record FinishRentalCommand : IRequest
    {
        public required DateTime ReturnDateTime { get; set; }

        public required int OdometerEnd { get; set; }

        public string? Notes { get; set; }

        public List<IFormFile>? Files { get; set; }
    }

    public class FinishRentalCommandHandler(IApplicationDbContext _context, IFileService _fileService) : IRequestHandler<FinishRentalCommand>
    {
        public async ValueTask<Unit> Handle(FinishRentalCommand request, CancellationToken cancellationToken)
        {
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

            var entity = request.Adapt<Rental>();

            entity.Files = photoFiles;
            entity.Status = RentalStatus.Returned;

            _context.Rentals.Add(entity);

            await _context.SaveChangesAsync(cancellationToken);

            return Unit.Value;
        }
    }
}
