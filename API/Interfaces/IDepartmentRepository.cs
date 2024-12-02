using API.DTOs;
using API.Entities;

namespace API.Interfaces;

public interface IDepartmentRepository
{
    void AddDepartment(Department department);
    void DeleteDepartment(Department department);
    Task<IEnumerable<DepartmentDto>> GetDepartmentsAsync();
    Task<Department?> GetDepartmentByIdAsync(int departmentId);
    Task<Department?> GetDepartmentDetailedByIdAsync(int departmentId);
    Task<bool> Complete();
}
