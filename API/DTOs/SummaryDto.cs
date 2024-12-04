namespace API.DTOs;

public class SummaryDto
{
    public EmployeeDto Employee { get; set; } = null!;
    public DateOnly Date { get; set; }
    public double WorkShiftMinutes { get; set; }
    public double WorkRecordMinutes { get; set; }
    public WorkShiftDto? WorkShift { get; set; }
    public IEnumerable<WorkRecordDto> WorkRecords { get; set; } = [];
}
