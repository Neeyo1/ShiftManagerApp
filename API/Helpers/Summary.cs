using API.Entities;

namespace API.Helpers;

public class Summary
{
    public Employee Employee { get; set; } = null!;
    public DateOnly Date { get; set; }
    public double WorkShiftMinutes { get; set; }
    public double WorkRecordMinutes { get; set; }
    public WorkShift? WorkShift { get; set; }
    public IEnumerable<WorkRecord> WorkRecords { get; set; } = [];
}
