using API.DTOs;
using API.Entities;
using API.Helpers;
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

    public async Task<PagedList<EmployeeDto>> GetEmployeesAsync(EmployeeParams employeeParams)
    {
        var query = context.Employees.AsQueryable();

        if (employeeParams.EmployeeId != null)
        {
            query = query.Where(x => x.Id == employeeParams.EmployeeId);
        }

        if (employeeParams.DepartmentId != null)
        {
            query = query.Where(x => x.DepartmentId == employeeParams.DepartmentId);
        }

        if (employeeParams.FirstName != null)
        {
            query = query.Where(x => x.FirstName.Contains(employeeParams.FirstName));
        }

        if (employeeParams.LastName != null)
        {
            query = query.Where(x => x.LastName.Contains(employeeParams.LastName));
        }

        query = employeeParams.Status switch
        {
            "active" => query.Where(x => x.IsActive == true),
            "not-active" => query.Where(x => x.IsActive == false),
            _ => query
        };

        query = employeeParams.OrderBy switch
        {
            "lastName" => query.OrderBy(x => x.LastName),
            "lastName-desc" => query.OrderByDescending(x => x.LastName),
            "firstName" => query.OrderBy(x => x.FirstName),
            "firstName-desc" => query.OrderByDescending(x => x.FirstName),
            _ => query.OrderBy(x => x.LastName),
        };

        return await PagedList<EmployeeDto>.CreateAsync(
            query.ProjectTo<EmployeeDto>(mapper.ConfigurationProvider), 
            employeeParams.PageNumber, employeeParams.PageSize);
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
