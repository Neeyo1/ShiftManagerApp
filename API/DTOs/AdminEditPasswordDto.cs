using System.ComponentModel.DataAnnotations;

namespace API.DTOs;

public class AdminEditPasswordDto
{
    [Required]
    [StringLength(24, MinimumLength = 8)]
    public required string NewPassword { get; set; }
}
