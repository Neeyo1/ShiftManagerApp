using API.DTOs;
using API.Entities;
using API.Interfaces;
using AutoMapper;
using AutoMapper.QueryableExtensions;
using Microsoft.EntityFrameworkCore;

namespace API.Data;

public class EmployeeRepository(DataContext context, IMapper mapper) : IEmployeeRepository
{
    public void AddEmployee(Employee employee)
    {
        context.Employees.Add(employee);
    }

    public void DeleteEmployee(Employee employee)
    {
        context.Employees.Remove(employee);
    }

    public async Task<IEnumerable<EmployeeDto>> GetEmployeesAsync()
    {
        return await context.Employees
            .ProjectTo<EmployeeDto>(mapper.ConfigurationProvider)
            .ToListAsync();
    }

    public async Task<Employee?> GetEmployeeByIdAsync(int employeeId)
    {
        return await context.Employees
            .FindAsync(employeeId);
    }

    public async Task<bool> Complete()
    {
        return await context.SaveChangesAsync() > 0;
    }
}
