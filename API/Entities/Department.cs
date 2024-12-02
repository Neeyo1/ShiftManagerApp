namespace API.Entities;

public class Department
{
    public int Id { get; set; }
    public required string Name { get; set; }

    //Department - AppUser
    public ICollection<AppUser> Managers { get; set; } = [];

    //Deprtment - Employee
    public ICollection<Employee> Employees { get; set; } = [];
}
