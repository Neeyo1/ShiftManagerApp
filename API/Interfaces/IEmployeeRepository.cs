using API.DTOs;
using API.Entities;
using API.Helpers;

namespace API.Interfaces;

public interface IEmployeeRepository
{
    void AddEmployee(Employee employee);
    void DeleteEmployee(Employee employee);
    Task<PagedList<EmployeeDto>> GetEmployeesAsync(EmployeeParams employeeParams);
    Task<Employee?> GetEmployeeByIdAsync(int employeeId);
}
