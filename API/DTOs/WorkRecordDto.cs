namespace API.DTOs;

public class WorkRecordDto
{
    public int Id { get; set; }
    public DateTime Start { get; set; }
    public DateTime? End { get; set; }
    public int EmployeeId { get; set; }
}
