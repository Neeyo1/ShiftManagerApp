using System.ComponentModel.DataAnnotations;

namespace API.DTOs;

public class UserEditPasswordDto
{
    [Required]
    [StringLength(24, MinimumLength = 8)]
    public required string CurrentPassword { get; set; }

    [Required]
    [StringLength(24, MinimumLength = 8)]
    public required string NewPassword { get; set; }
}
