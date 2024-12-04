using System.ComponentModel.DataAnnotations;

namespace API.DTOs;

public class WorkShiftEditDto
{
    [Required]
    public required DateTime Start { get; set; }

    [Required]
    public int ShiftLength { get; set; }
}
