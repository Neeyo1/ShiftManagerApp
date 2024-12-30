namespace API.DTOs;

public class SummaryDto
{
    public EmployeeDto Employee { get; set; } = null!;
    public int TotalWorkShiftMinutes { get; set; }
    public int TotalWorkRecordMinutes { get; set; }
    public IEnumerable<SummaryWorkDetailDto> SummaryWorkDetails { get; set; } = [];
}
