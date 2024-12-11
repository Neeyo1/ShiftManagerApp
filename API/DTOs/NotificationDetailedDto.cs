namespace API.DTOs;

public class NotificationDetailedDto
{
    public int Id { get; set; }
    public required string Title { get; set; }
    public required string Content { get; set; }
    public DateTime CreatedAt { get; set; }
    public DateTime? ReadAt { get; set; }
    public bool IsChanged { get; set; }
}
