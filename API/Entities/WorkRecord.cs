namespace API.Entities;

public class WorkRecord
{
    public int Id { get; set; }
    public DateTime Start { get; set; }
    public DateTime? End { get; set; } = null;

    //WorkRecord - Employee
    public int EmployeeId { get; set; }
    public Employee Employee { get; set; } = null!;
}
