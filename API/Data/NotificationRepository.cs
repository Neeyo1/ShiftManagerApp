using API.DTOs;
using API.Entities;
using API.Helpers;
using API.Interfaces;
using AutoMapper;
using AutoMapper.QueryableExtensions;

namespace API.Data;

public class NotificationRepository(DataContext context, IMapper mapper) : INotificationRepository
{
    public void AddNotification(Notification notification)
    {
        context.Notifications.Add(notification);
    }

    public void DeleteNotification(Notification notification)
    {
        context.Notifications.Remove(notification);
    }

    public async Task<PagedList<NotificationDto>> GetNotificationsAsync(NotificationParams notificationParams)
    {
        var query = context.Notifications.AsQueryable();

        query = query.Where(x => x.UserId == notificationParams.UserId);

        query = notificationParams.Status switch
        {
            "read" => query.Where(x => x.IsRead == true),
            "unread" => query.Where(x => x.IsRead == false),
            "all" => query,
            _ => query
        };

        query = notificationParams.OrderBy switch
        {
            "received" => query.OrderBy(x => x.CreatedAt),
            "received-desc" => query.OrderByDescending(x => x.CreatedAt),
            "read" => query.OrderBy(x => x.ReadAt),
            "read-desc" => query.OrderByDescending(x => x.ReadAt),
            _ => query.OrderByDescending(x => x.CreatedAt),
        };

        return await PagedList<NotificationDto>.CreateAsync(
            query.ProjectTo<NotificationDto>(mapper.ConfigurationProvider), 
            notificationParams.PageNumber, notificationParams.PageSize);
    }

    public async Task<Notification?> GetNotificationByIdAsync(int notificationId)
    {
        return await context.Notifications
            .FindAsync(notificationId);
    }
}
