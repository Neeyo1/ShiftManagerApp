using System.Net;
using System.Net.Mail;
using API.Entities;
using API.Helpers;
using API.Interfaces;
using Microsoft.Extensions.Options;

namespace API.Services;

public class EmailService(IOptions<EmailSettings> config) : IEmailService
{
    private readonly EmailSettings _emailSettings = config.Value;

    public async Task SendEmailAsync(AppUser user, string subject, string body)
    {
        var smtpClient = new SmtpClient(_emailSettings.Host, _emailSettings.Port)
        {
            Credentials = new NetworkCredential(_emailSettings.UserName, _emailSettings.Password),
            EnableSsl = _emailSettings.EnableSsl
        };

        var mailMessage = new MailMessage
        {
            From = new MailAddress(_emailSettings.FromEmail, _emailSettings.FromName),
            Subject = subject,
            Body = body,
            IsBodyHtml = false // Set to true if sending HTML email
        };

        mailMessage.To.Add(user.Email!);

        await smtpClient.SendMailAsync(mailMessage);

        user.LastEmailSent = DateTime.UtcNow;
    }
}
