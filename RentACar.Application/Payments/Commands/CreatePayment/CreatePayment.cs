using Mediator;
using Microsoft.AspNetCore.Http;
using QuestPDF.Fluent;
using QuestPDF.Infrastructure;
using RentACar.Application.Common.Helpers;
using RentACar.Application.Common.Interfaces;
using RentACar.Domain.Entities;
using Invoice = RentACar.Domain.Entities.Invoice;


namespace RentACar.Application.Payments.Commands.CreatePayment
{
    public class NewPaymentResponse
    {
        public string? InvoicePath { get; set; }   
    }

    public record CreatePaymentCommand : IRequest<NewPaymentResponse>
    {
        public required decimal Amount { get; set; }

        public required string StripePaymentIntentId { get; set; }

        public int? ReservationId { get; set; }
    }

    public class CreatePaymentCommandHandler(IApplicationDbContext _context, IFileService _fileService) : IRequestHandler<CreatePaymentCommand, NewPaymentResponse>
    {
        public async ValueTask<NewPaymentResponse> Handle(CreatePaymentCommand request, CancellationToken cancellationToken)
        {
            var payment = request.Adapt<Payment>();
            payment.CreatedAt = DateTime.Now;

            _context.Payments.Add(payment);

            var invoice = new Invoice
            {
                InvoiceNumber = Guid.NewGuid().ToString(),
                IssuedAt = DateTime.UtcNow,
                TotalAmount = request.Amount,
                ReservationId = request.ReservationId,
                Payments = [payment],
            };

            _context.Invoices.Add(invoice);

            QuestPDF.Settings.License = LicenseType.Community;

            var document = new InvoiceDocument(invoice);

            var pdfBytes = document.GeneratePdf();

            var pdfFile = new ByteArrayFormFile(pdfBytes, $"{invoice.InvoiceNumber}.pdf");
            var savedFilePath = await _fileService.SaveFileAsync(pdfFile, [".pdf"]);


            invoice.File = new Domain.Entities.File
            {
                Path = savedFilePath,
                Name = $"{invoice.InvoiceNumber}.pdf"
            };

            await _context.SaveChangesAsync(cancellationToken);

            return new NewPaymentResponse
            {
                InvoicePath = invoice.File.Path
            };
        }

        public class ByteArrayFormFile(byte[] content, string fileName) : IFormFile
        {
            public string ContentType { get; } = "application/pdf";
            public string ContentDisposition { get; set; }
            public IHeaderDictionary Headers { get; } = new HeaderDictionary();
            public long Length { get; } = content.Length;
            public string Name { get; } = "file";
            public string FileName { get; } = fileName;

            public void CopyTo(Stream target)
            {
                using var stream = new MemoryStream(content);
                stream.CopyTo(target);
            }

            public Task CopyToAsync(Stream target, CancellationToken cancellationToken = default)
            {
                using var stream = new MemoryStream(content);
                return stream.CopyToAsync(target, cancellationToken);
            }

            public Stream OpenReadStream()
            {
                return new MemoryStream(content);
            }
        }
    }
}
