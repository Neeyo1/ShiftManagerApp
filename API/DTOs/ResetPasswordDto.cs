using System.ComponentModel.DataAnnotations;

namespace API.DTOs;

public class ResetPasswordDto
{
    [Required]
    [StringLength(24, MinimumLength = 8)]
    public required string NewPassword { get; set; }
    public string? Email { get; set; }
    public string? Token { get; set; }
}
