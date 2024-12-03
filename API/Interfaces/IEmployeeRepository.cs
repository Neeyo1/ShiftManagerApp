using API.DTOs;
using API.Entities;

namespace API.Interfaces;

public interface IEmployeeRepository
{
    void AddEmployee(Employee employee);
    void DeleteEmployee(Employee employee);
    Task<IEnumerable<EmployeeDto>> GetEmployeesAsync();
    Task<Employee?> GetEmployeeByIdAsync(int employeeId);
    Task<bool> Complete();
}
