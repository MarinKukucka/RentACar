using Microsoft.Extensions.Logging;
using RentACar.Domain.Entities;
using System.Net.Mail;
using System.Net;
using RentACar.Application.Common.Interfaces;

namespace RentACar.Infrastructure.Services
{
    public class SmtpEmailSender(ILogger<SmtpEmailSender> logger) : IEmailSender<ApplicationUser>
    {
        private const string SmtpHost = "smtp-relay.brevo.com";
        private const int SmtpPort = 587;
        private const bool EnableSsl = true;
        private const string SenderEmail = "capcarap.noreply@gmail.com"; // This should be a verified sender email in Brevo, maybe your company email
        private const string SmtpUser = "8f891e002@smtp-brevo.com"; // Your SMTP login from Brevo
        private const string SmtpPassword = "fApFs5WUxMb9qakP"; // Your Master Password (or SMTP key)




        public async Task SendConfirmationLinkAsync(
            ApplicationUser user,
            string toEmail,
            string link)
        {
            var subject = "Your Agent Account Invitation";
            var html = $@"
                <p>Hello {user.UserName},</p>
                <p>You have been invited as an Agent. Please <a href=""{link}"">click here</a> 
                   to set your password and activate your account.</p>
                <p>If you didn’t expect this, please ignore this email.</p>";

            await SendEmailAsync(toEmail, subject, html);
        }

        public async Task SendEmailAsync(
            string toEmail,
            string subject,
            string htmlMessage)
        {
            using var client = new SmtpClient(SmtpHost, SmtpPort)
            {
                EnableSsl = EnableSsl,
                Credentials = new NetworkCredential(SmtpUser, SmtpPassword)
            };

            using var mail = new MailMessage
            {
                From = new MailAddress(SenderEmail, "RentACar"),
                Subject = subject,
                Body = htmlMessage,
                IsBodyHtml = true
            };

            mail.To.Add(toEmail);

            try
            {
                await client.SendMailAsync(mail);
                logger.LogInformation("Email sent to {Email}", toEmail);
            }
            catch (Exception ex)
            {
                logger.LogError(ex, "Failed to send email to {Email}", toEmail);
                throw;
            }
        }

        public async Task SendPasswordResetLinkAsync(ApplicationUser user, string email, string resetLink)
        {
            string subject = "RentACar - Zaboravljena lozinka";
            string message = $"Za postavljanje nove lozinke kliknite <a href=\"{resetLink}\">ovdje</a>";
            await SendEmailAsync(email, subject, message);
        }

        public async Task SendEmailWithAttachmentAsync(
            string toEmail,
            string subject,
            string htmlMessage,
            byte[] attachment,
            string attachmentName)
        {
            using var client = new SmtpClient(SmtpHost, SmtpPort)
            {
                EnableSsl = EnableSsl,
                Credentials = new NetworkCredential(SmtpUser, SmtpPassword)
            };

            using var mail = new MailMessage
            {
                From = new MailAddress(SenderEmail, "RentACar"),
                Subject = subject,
                Body = htmlMessage,
                IsBodyHtml = true
            };

            mail.To.Add(toEmail);

            // Create attachment
            var stream = new MemoryStream(attachment);
            var mailAttachment = new Attachment(stream, attachmentName, "application/pdf");
            mail.Attachments.Add(mailAttachment);

            try
            {
                await client.SendMailAsync(mail);
                logger.LogInformation("Email with attachment sent to {Email}", toEmail);
            }
            catch (Exception ex)
            {
                logger.LogError(ex, "Failed to send email with attachment to {Email}", toEmail);
                throw;
            }
        }
    }
}
