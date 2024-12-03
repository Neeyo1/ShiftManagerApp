using System.ComponentModel.DataAnnotations;

namespace API.DTOs;

public class EmployeeCreateDto
{
    [Required]
    [StringLength(24)]
    public required string FirstName { get; set; }

    [Required]
    [StringLength(48)]
    public required string LastName { get; set; }

    [Required]
    public int DepartmentId { get; set; }
}
