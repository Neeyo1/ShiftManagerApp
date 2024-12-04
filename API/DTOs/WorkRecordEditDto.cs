using System.ComponentModel.DataAnnotations;

namespace API.DTOs;

public class WorkRecordEditDto
{
    [Required]
    public required DateTime Start { get; set; }

    [Required]
    public required DateTime End { get; set; }
}
