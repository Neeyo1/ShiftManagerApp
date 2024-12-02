namespace API.DTOs;

public class DepartmentDto
{
    public int Id { get; set; }
    public required string Name { get; set; }
    public IEnumerable<ManagerDto> Managers { get; set; } = [];
}
