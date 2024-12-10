namespace API.Entities;

public class Notification
{
    public int Id { get; set; }
    public required string Title { get; set; }
    public required string Content { get; set; }
    public bool IsRead { get; set; } = false;
    public DateTime CreatedAt { get; set; } = DateTime.UtcNow;
    public DateTime? ReadAt { get; set; }

    //Notifiction - AppUser
    public int UserId { get; set; }
    public AppUser User { get; set; } = null!;
}
