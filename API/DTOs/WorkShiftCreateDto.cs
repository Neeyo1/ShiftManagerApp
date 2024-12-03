using System.ComponentModel.DataAnnotations;

namespace API.DTOs;

public class WorkShiftCreateDto
{
    [Required]
    public required string DateFrom { get; set; }

    [Required]
    public required string DateTo { get; set; }

    [Required]
    public required string Start { get; set; }

    [Required]
    public int ShiftLength { get; set; }

    [Required]
    public int EmployeeId { get; set; }
}
