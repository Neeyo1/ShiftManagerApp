using API.DTOs;
using API.Entities;
using API.Helpers;

namespace API.Interfaces;

public interface INotificationRepository
{
    void AddNotification(Notification notification);
    void DeleteNotification(Notification notification);
    Task<PagedList<NotificationDto>> GetNotificationsAsync(NotificationParams notificationParams);
    Task<Notification?> GetNotificationByIdAsync(int notificationId);
    Task<bool> Complete();
}
