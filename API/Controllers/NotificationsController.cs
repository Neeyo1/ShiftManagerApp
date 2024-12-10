using API.DTOs;
using API.Entities;
using API.Extensions;
using API.Helpers;
using API.Interfaces;
using AutoMapper;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace API.Controllers;

[Authorize]
public class NotificationsController(INotificationRepository notificationRepository, IUserRepository userRepository,
    IMapper mapper) : BaseApiController
{
    [HttpGet]
    public async Task<ActionResult<PagedList<NotificationDto>>> GetNotifications(
        [FromQuery] NotificationParams notificationParams)
    {
        var user = await userRepository.GetUserByIdAsync(User.GetUserId());
        if (user == null) return NotFound();

        notificationParams.UserId = user.Id;

        var notifications = await notificationRepository.GetNotificationsAsync(notificationParams);
        Response.AddPaginationHeader(notifications);
        
        return Ok(notifications);
    }

    [HttpGet("{notificationId}")]
    public async Task<ActionResult<NotificationDetailedDto>> GetNotification(int notificationId)
    {
        var user = await userRepository.GetUserByIdAsync(User.GetUserId());
        if (user == null) return NotFound();

        var notification = await notificationRepository.GetNotificationByIdAsync(notificationId);
        if (notification == null) return NotFound();
        if (notification.UserId != user.Id) return Unauthorized();

        if (notification.IsRead == false)
        {
            notification.IsRead = true;
            notification.ReadAt = DateTime.UtcNow;

            if (await notificationRepository.Complete())
                return Ok(mapper.Map<NotificationDetailedDto>(notification));
            return BadRequest("Failed to read notification");
        }
        else
        {
            return Ok(mapper.Map<NotificationDetailedDto>(notification));
        }
    }

    [HttpPost]
    public async Task<ActionResult<NotificationDto>> CreateDummyNotification()
    {
        var user = await userRepository.GetUserByIdAsync(User.GetUserId());
        if (user == null) return NotFound();

        var notification = new Notification
        {
            Title = "Dummy notification",
            Content = "this is dummy's notofication content, if you can read it, notification has been marked as read",
            UserId = user.Id
        };

        notificationRepository.AddNotification(notification);

        if (await notificationRepository.Complete())
            return NoContent();
        return BadRequest("Failed to read notification");
    }
}
