namespace API.Entities;

public class WorkShift
{
    public int Id { get; set; }
    public DateOnly Date { get; set; }
    public DateTime Start { get; set; }
    public DateTime End { get; set; }

    //WorkShift - Employee
    public int EmployeeId { get; set; }
    public Employee Employee { get; set; } = null!;
}
