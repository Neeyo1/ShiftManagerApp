using System.ComponentModel.DataAnnotations;

namespace API.DTOs;

public class WorkRecordEditDto
{
    [Required]
    public required string HourStart { get; set; }

    [Required]
    public required string DateStart { get; set; }

    [Required]
    public required string HourEnd { get; set; }

    [Required]
    public required string DateEnd { get; set; }
}
