using API.DTOs;
using API.Entities;
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

    public async Task<IEnumerable<DepartmentDto>> GetDepartmentsAsync()
    {
        return await context.Departments
            .ProjectTo<DepartmentDto>(mapper.ConfigurationProvider)
            .ToListAsync();
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
