using API.Entities;

namespace API.Helpers;

public class Summary
{
    public Employee Employee { get; set; } = null!;
    public double TotalWorkShiftMinutes { get; set; }
    public double TotalWorkRecordMinutes { get; set; }
    public IEnumerable<SummaryWorkDetail> SummaryWorkDetails { get; set; } = [];
}
