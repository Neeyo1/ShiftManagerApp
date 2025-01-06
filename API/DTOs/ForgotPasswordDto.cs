using System.ComponentModel.DataAnnotations;

namespace API.DTOs;

public class ForgotPasswordDto
{
    [Required]
    public required string Email { get; set; }
}
