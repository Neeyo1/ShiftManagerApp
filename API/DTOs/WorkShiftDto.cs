namespace API.DTOs;

public class WorkShiftDto
{
    public int Id { get; set; }
    public DateOnly Date { get; set; }
    public DateTime Start { get; set; }
    public DateTime End { get; set; }
    public int EmployeeId { get; set; }
}
