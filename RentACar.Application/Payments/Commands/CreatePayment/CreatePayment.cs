using Mediator;
using Microsoft.AspNetCore.Http;
using Microsoft.EntityFrameworkCore;
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

    public class CreatePaymentCommandHandler(IApplicationDbContext _context, IFileService _fileService, IEmailSender<ApplicationUser> _emailSender) : IRequestHandler<CreatePaymentCommand, NewPaymentResponse>
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
                Payment = payment,
            };

            _context.Invoices.Add(invoice);

            await _context.SaveChangesAsync(cancellationToken);

            var invoiceModel = await _context.Invoices
                .Include(i => i.Reservation)
                    .ThenInclude(r => r!.ExtraServices)
                .Include(i => i.Reservation)
                    .ThenInclude(r => r!.Vehicle)
                        .ThenInclude(v => v!.Model)
                            .ThenInclude(m => m!.Brand)
                .Where(i => i.Id == invoice.Id && i.Reservation != null && i.Reservation.Vehicle != null && i.Reservation.Vehicle.Model != null && i.Reservation.Vehicle.Model.Brand != null)
                .FirstOrDefaultAsync(cancellationToken);

            QuestPDF.Settings.License = LicenseType.Community;

            var reservation = await _context.Reservations
                .Include(r => r.Person)
                .FirstOrDefaultAsync(r => r.Id == request.ReservationId, cancellationToken);

            var document = new InvoiceDocument(invoiceModel!, reservation!.Person!);

            var pdfBytes = document.GeneratePdf();

            var pdfFile = new ByteArrayFormFile(pdfBytes, $"{invoice.InvoiceNumber}.pdf");
            var savedFilePath = await _fileService.SaveFileAsync(pdfFile, [".pdf"]);


            invoice.File = new Domain.Entities.File
            {
                Path = savedFilePath,
                Name = $"{invoice.InvoiceNumber}.pdf"
            };

            await _context.SaveChangesAsync(cancellationToken);

            var emailInvoice = await _context.Invoices
                .Include(i => i.Reservation)
                    .ThenInclude(r => r!.Person)
                .Where(i => i.Id == invoice.Id)
                .FirstOrDefaultAsync(cancellationToken);

            if (emailInvoice != null && emailInvoice.Reservation?.Person?.Email is string customerEmail)
            {
                var fullName = emailInvoice.Reservation.Person.FirstName + " " + emailInvoice.Reservation.Person.LastName ?? "Customer";

                await _emailSender.SendEmailWithAttachmentAsync(
                    toEmail: customerEmail,
                    subject: $"Your Invoice #{emailInvoice.InvoiceNumber}",
                    htmlMessage: $"""
            <p>Dear {fullName},</p>
            <p>Thank you for your payment of <strong>{emailInvoice.TotalAmount:C}</strong>.</p>
            <p>Your invoice is attached as a PDF document.</p>
            <p>Best regards,<br/>RentACar Support</p>
        """,
                    attachment: pdfBytes,
                    attachmentName: $"{emailInvoice.InvoiceNumber}.pdf"
                );
            }


            return new NewPaymentResponse
            {
                InvoicePath = invoice.File.Path
            };
        }

        public class ByteArrayFormFile(byte[] content, string fileName) : IFormFile
        {
            public string ContentType { get; } = "application/pdf";
            public string ContentDisposition { get; set; } = string.Empty;
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
