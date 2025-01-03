using System.ComponentModel.DataAnnotations;

namespace API.DTOs;

public class MailConfirm
{
    [Required] public required string Email { get; set; }
    [Required] public required string Token { get; set; }
}
