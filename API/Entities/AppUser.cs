using Microsoft.AspNetCore.Identity;

namespace API.Entities;

public class AppUser : IdentityUser<int>
{
    public required string FirstName { get; set; }
    public required string LastName { get; set; }
    public DateTime CreatedAt { get; set; } = DateTime.UtcNow;
    public DateTime LastActive { get; set; } = DateTime.UtcNow;

    //AppUser - AppUserRole
    public ICollection<AppUserRole> UserRoles { get; set; } = [];

    //AppUser - Department
    public int? DepartmentId { get; set; }
    public Department? Department { get; set; }

    //AppUser - Notification
    public ICollection<Notification> Notifications { get; set; } = [];
}
