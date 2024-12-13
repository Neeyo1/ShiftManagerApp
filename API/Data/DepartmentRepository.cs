using API.DTOs;
using API.Entities;
using API.Helpers;
using API.Interfaces;
using AutoMapper;
using AutoMapper.QueryableExtensions;
using Microsoft.EntityFrameworkCore;

namespace API.Data;

public class DepartmentRepository(DataContext context, IMapper mapper) : IDepartmentRepository
{
    public void AddDepartment(Department department)
    {
        context.Departments.Add(department);
    }

    public void DeleteDepartment(Department department)
    {
        context.Departments.Remove(department);
    }

    public async Task<PagedList<DepartmentDto>> GetDepartmentsAsync(DepartmentParams departmentParams)
    {
        var query = context.Departments.AsQueryable();

        if (departmentParams.DepartmentId != null)
        {
            query = query.Where(x => x.Id == departmentParams.DepartmentId);
        }

        if (departmentParams.Name != null)
        {
            query = query.Where(x => x.Name == departmentParams.Name);
        }

        query = departmentParams.OrderBy switch
        {
            "name" => query.OrderBy(x => x.Name),
            "name-desc" => query.OrderByDescending(x => x.Name),
            "most-employees" => query.OrderByDescending(x => x.Employees.Count),
            "least-employees" => query.OrderBy(x => x.Employees.Count),
            _ => query.OrderBy(x => x.Name)
        };

        return await PagedList<DepartmentDto>.CreateAsync(
            query.ProjectTo<DepartmentDto>(mapper.ConfigurationProvider), 
            departmentParams.PageNumber, departmentParams.PageSize);
    }

    public async Task<Department?> GetDepartmentByIdAsync(int departmentId)
    {
        return await context.Departments
            .FindAsync(departmentId);
    }

    public async Task<Department?> GetDepartmentDetailedByIdAsync(int departmentId)
    {
        return await context.Departments
            .Include(x => x.Managers)
            .Include(x => x.Employees)
            .FirstOrDefaultAsync(x => x.Id == departmentId);
    }

    public async Task<bool> Complete()
    {
        return await context.SaveChangesAsync() > 0;
    }
}
