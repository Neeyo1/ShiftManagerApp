using API.Entities;

namespace API.Interfaces;

public interface INotificationService
{
    void CreateNotifications(IEnumerable<AppUser> users, string title, string content);
}
