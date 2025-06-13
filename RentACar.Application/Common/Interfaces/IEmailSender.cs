using RentACar.Domain.Entities;

namespace RentACar.Application.Common.Interfaces
{
    public interface IEmailSender<TUser>
    {
        Task SendConfirmationLinkAsync(TUser user, string toEmail, string link);
        Task SendEmailAsync(string toEmail, string subject, string htmlMessage);
        Task SendPasswordResetLinkAsync(ApplicationUser user, string email, string resetLink);
        Task SendEmailWithAttachmentAsync(string toEmail, string subject, string htmlMessage, byte[] attachment, string attachmentName);
    }
}
