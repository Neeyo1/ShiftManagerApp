using System.ComponentModel.DataAnnotations;

namespace API.DTOs;

public class SendMailDto
{
    [Required] public required string ToMail { get; set; } 
    [Required] public required string Subject { get; set; }
    [Required] public required string Body { get; set; }
}
