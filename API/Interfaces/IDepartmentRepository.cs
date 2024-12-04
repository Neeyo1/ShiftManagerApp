using API.DTOs;
using API.Entities;
using API.Helpers;

namespace API.Interfaces;

public interface IDepartmentRepository
{
    void AddDepartment(Department department);
    void DeleteDepartment(Department department);
    Task<PagedList<DepartmentDto>> GetDepartmentsAsync(DepartmentParams departmentParams);
    Task<Department?> GetDepartmentByIdAsync(int departmentId);
    Task<Department?> GetDepartmentDetailedByIdAsync(int departmentId);
    Task<bool> Complete();
}
