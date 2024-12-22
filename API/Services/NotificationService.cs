using API.Entities;
using API.Interfaces;

namespace API.Services;

public class NotificationService(IUnitOfWork unitOfWork) : INotificationService
{
    public void CreateNotifications(IEnumerable<AppUser> users, string title, string content)
    {
        foreach (var user in users)
        {
            var notification = new Notification
            {
                Title = title,
                Content = content,
                UserId = user.Id
            };

            unitOfWork.NotificationRepository.AddNotification(notification);
        }
    }
}
