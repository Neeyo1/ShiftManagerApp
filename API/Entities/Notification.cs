namespace API.Entities;

public class Notification
{
    public int Id { get; set; }
    public required string Title { get; set; }
    public required string Content { get; set; }
    public bool IsRead { get; set; }

    //Notifiction - AppUser
    public int UserId { get; set; }
    public AppUser User { get; set; } = null!;
}
