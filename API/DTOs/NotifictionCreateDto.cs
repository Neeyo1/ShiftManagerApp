using System.ComponentModel.DataAnnotations;

namespace API.DTOs;

public class NotificationCreateDto
{
    [Required]
    public required string Message { get; set; }
}
