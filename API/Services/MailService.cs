using System.Net;
using System.Net.Mail;
using API.Helpers;
using API.Interfaces;
using Microsoft.Extensions.Options;

namespace API.Services;

public class MailService(IOptions<MailSettings> config) : IMailService
{
    private readonly MailSettings _mailSettings = config.Value;

    public async Task SendMailAsync(string toEmail, string subject, string body)
    {
        var smtpClient = new SmtpClient(_mailSettings.Host, _mailSettings.Port)
        {
            Credentials = new NetworkCredential(_mailSettings.UserName, _mailSettings.Password),
            EnableSsl = _mailSettings.EnableSsl
        };

        var mailMessage = new MailMessage
        {
            From = new MailAddress(_mailSettings.FromEmail, _mailSettings.FromName),
            Subject = subject,
            Body = body,
            IsBodyHtml = false // Set to true if sending HTML email
        };

        mailMessage.To.Add(toEmail);

        await smtpClient.SendMailAsync(mailMessage);
    }
}
