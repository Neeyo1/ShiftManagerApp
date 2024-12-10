namespace API.DTOs;

public class NotificationDto
{
    public int Id { get; set; }
    public required string Title { get; set; }
    public bool IsRead { get; set; } = false;
    public DateTime CreatedAt { get; set; }
    public DateTime? ReadAt { get; set; }
}
