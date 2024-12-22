using API.Entities;
using API.Extensions;
using API.Interfaces;
using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.SignalR;

namespace API.SignalR;

public class NotificationHub(IUnitOfWork unitOfWork, UserManager<AppUser> userManager) : Hub
{
    public override async Task OnConnectedAsync()
    {
        if (Context.User == null) 
            throw new HubException("Cannot find user");

        var user = await unitOfWork.UserRepository.GetUserByIdAsync(Context.User.GetUserId());
        if (user == null)
            throw new HubException("Cannot find user");

        var roles = await userManager.GetRolesAsync(user);
        if (roles.Contains("Admin"))
        {
            await Groups.AddToGroupAsync(Context.ConnectionId, "admins");
        }
        else if (roles.Contains("User"))
        {
            await Groups.AddToGroupAsync(Context.ConnectionId, "users");
        }
        else if (roles.Contains("Manager"))
        {
            if (user.DepartmentId == null)
                throw new HubException("Cannot find department to join");
            
            var groupName = $"group-department-{user.DepartmentId}";
            await Groups.AddToGroupAsync(Context.ConnectionId, groupName);
        }
        else
        {
            throw new HubException("Failed to join any group");
        }
    }

    public override async Task OnDisconnectedAsync(Exception? exception)
    {
        await base.OnDisconnectedAsync(exception);
    }

    public async Task SendNotification(string group, int? departmentId)
    {
        switch (group)
        {
            case "admins":
                await Clients.Group("admins").SendAsync("NewNotification");
                break;
            case "users":
                await Clients.Group("users").SendAsync("NewNotification");
                break;
            case "managers":
                if (departmentId != null)
                {
                    var department = await unitOfWork.DepartmentRepository.GetDepartmentDetailedByIdAsync((int)departmentId);
                    if (department == null) throw new HubException("Cannot find department");

                    var groupName = $"group-department-{department.Id}";
                    await Clients.Group(groupName).SendAsync("NewNotification");
                }
                break;
            default:
                throw new HubException("Failed to send notification");
        }
    }
}