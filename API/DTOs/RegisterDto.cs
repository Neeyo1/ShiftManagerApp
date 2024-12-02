using System.ComponentModel.DataAnnotations;

namespace API.DTOs;

public class RegisterDto
{
    [Required]
    [StringLength(24, MinimumLength = 6)]
    public required string Username { get; set; }

    [Required]
    [StringLength(24, MinimumLength = 8)]
    public required string Password { get; set; }

    [Required]
    [StringLength(24)]
    public required string FirstName { get; set; }

    [Required]
    [StringLength(48)]
    public required string LastName { get; set; }
}
