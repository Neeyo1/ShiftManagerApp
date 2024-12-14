using System.ComponentModel.DataAnnotations;

namespace API.DTOs;

public class TokenDto
{
    [Required]
    public required string Token { get; set; }
}
