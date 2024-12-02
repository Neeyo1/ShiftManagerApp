using System.ComponentModel.DataAnnotations;

namespace API.DTOs;

public class DepartmentCreateDto
{
    [Required]
    [StringLength(50, MinimumLength = 5)]
    public required string Name { get; set; }
}
