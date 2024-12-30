namespace API.DTOs;

public class SummaryWorkDetailDto
{
    public DateOnly Date { get; set; }
    public int WorkShiftMinutes { get; set; }
    public int WorkRecordMinutes { get; set; }
    public WorkShiftDto? WorkShift { get; set; }
}
