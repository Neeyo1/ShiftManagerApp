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
public class NotificationsController(IUnitOfWork unitOfWork, IMapper mapper) : BaseApiController
{
    [HttpGet]
    public async Task<ActionResult<PagedList<NotificationDto>>> GetNotifications(
        [FromQuery] NotificationParams notificationParams)
    {
        var user = await unitOfWork.UserRepository.GetUserByIdAsync(User.GetUserId());
        if (user == null) return NotFound();

        notificationParams.UserId = user.Id;

        var notifications = await unitOfWork.NotificationRepository.GetNotificationsAsync(notificationParams);
        Response.AddPaginationHeader(notifications);
        
        return Ok(notifications);
    }

    [HttpGet("{notificationId}")]
    public async Task<ActionResult<NotificationDetailedDto>> GetNotification(int notificationId)
    {
        var user = await unitOfWork.UserRepository.GetUserByIdAsync(User.GetUserId());
        if (user == null) return NotFound();

        var notification = await unitOfWork.NotificationRepository.GetNotificationByIdAsync(notificationId);
        if (notification == null) return NotFound();
        if (notification.UserId != user.Id) return Unauthorized();

        if (notification.IsRead == false)
        {
            notification.IsRead = true;
            notification.ReadAt = DateTime.UtcNow;

            if (await unitOfWork.Complete())
            {
                var result = mapper.Map<NotificationDetailedDto>(notification);
                result.IsChanged = true;
                return Ok(result);
            }
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
        var user = await unitOfWork.UserRepository.GetUserByIdAsync(User.GetUserId());
        if (user == null) return BadRequest("Failed to find user");

        var notification = new Notification
        {
            Title = "Dummy notification",
            Content = "this is dummy's notofication content, if you can read it, notification has been marked as read",
            UserId = user.Id
        };

        unitOfWork.NotificationRepository.AddNotification(notification);

        if (await unitOfWork.Complete())
            return NoContent();
        return BadRequest("Failed to read notification");
    }
}
