using System.ComponentModel.DataAnnotations;

namespace API.DTOs;

public class WorkShiftEditDto
{
    [Required]
    public required string Start { get; set; }

    [Required]
    public int ShiftLength { get; set; }
}
