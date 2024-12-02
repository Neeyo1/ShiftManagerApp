namespace API.DTOs;

public class ManagerDto
{
    public int Id { get; set; }
    public required string FirstName { get; set; }
    public required string LastName { get; set; }
    public DateTime LastActive { get; set; }
}
