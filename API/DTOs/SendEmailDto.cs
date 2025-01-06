using System.ComponentModel.DataAnnotations;

namespace API.DTOs;

public class SendEmailDto
{
    [Required] public required string ToEmail { get; set; } 
    [Required] public required string Subject { get; set; }
    [Required] public required string Body { get; set; }
}
