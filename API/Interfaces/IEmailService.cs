using API.Entities;

namespace API.Interfaces;

public interface IEmailService
{
    Task SendEmailAsync(AppUser user, string subject, string body);
}
