namespace API.Entities;

public class Employee
{
    public int Id { get; set; }
    public required string FirstName { get; set; }
    public required string LastName { get; set; }
    public bool IsActive { get; set; } = true;

    //Employee - Department
    public int DepartmentId { get; set; }
    public Department Department { get; set; } = null!;

    //Employee - WorkShift
    public ICollection<WorkShift> WorkShifts { get; set; } = [];

    //Employee - WorkRecord
    public ICollection<WorkRecord> WorkRecords { get; set; } = [];
}
