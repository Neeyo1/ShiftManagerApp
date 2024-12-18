using API.Entities;
using API.Extensions;
using API.Interfaces;
using Microsoft.AspNetCore.SignalR;

namespace API.SignalR;

public class NotificationHub(IUnitOfWork unitOfWork) : Hub
{
    public override async Task OnConnectedAsync()
    {
        if (Context.User == null) 
            throw new HubException("Cannot find user");

        var user = await unitOfWork.UserRepository.GetUserByIdAsync(Context.User.GetUserId());
        if (user == null)
            throw new HubException("Cannot find user");

        if (user.DepartmentId == null)
            throw new HubException("Cannot find department to join");

        var groupName = $"group-department-{user.DepartmentId}";
        await Groups.AddToGroupAsync(Context.ConnectionId, groupName);
    }

    public override async Task OnDisconnectedAsync(Exception? exception)
    {
        await base.OnDisconnectedAsync(exception);
    }

    public async Task SendNotification(int departmentId)
    {
        var department = await unitOfWork.DepartmentRepository.GetDepartmentDetailedByIdAsync(departmentId);
        if (department == null) throw new HubException("Cannot find department");

        foreach (var manager in department.Managers)
        {
            var notification = new Notification
            {
                Title = $"Department '{department.Name}' info",
                Content = $"Something important happened in '{department.Name}' department",
                UserId = manager.Id
            };

            unitOfWork.NotificationRepository.AddNotification(notification);
        }

        if (await unitOfWork.Complete())
        {
            var groupName = $"group-department-{department.Id}";
            await Clients.Group(groupName).SendAsync("NewNotification");
        }
    }
}