namespace API.Interfaces;

public interface IMailService
{
    Task SendMailAsync(string toEmail, string subject, string body);
}
