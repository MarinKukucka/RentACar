using Microsoft.Extensions.Logging;
using RentACar.Domain.Entities;
using System.Net.Mail;
using System.Net;

namespace RentACar.Infrastructure.Services
{
    public interface IEmailSender<TUser>
    {
        Task SendConfirmationLinkAsync(TUser user, string toEmail, string link);
        Task SendEmailAsync(string toEmail, string subject, string htmlMessage);
        Task SendPasswordResetLinkAsync(ApplicationUser user, string email, string resetLink);
    }

    public class SmtpEmailSender(ILogger<SmtpEmailSender> logger) : IEmailSender<ApplicationUser>
    {
        private const string SmtpHost = "smtp.gmail.com";
        private const int SmtpPort = 587;
        private const bool EnableSsl = true;
        private const string SenderName = "RentACar Support";
        private const string SenderEmail = "capcarap.noreply@gmail.com"; // replace with your Gmail
        private const string SmtpUser = "capcarap.noreply@gmail.com"; // same as above
        private const string SmtpPassword = "yrycwizbgygyyljw"; // your App Password

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
                From = new MailAddress(SenderEmail, SenderName),
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
    }
}
