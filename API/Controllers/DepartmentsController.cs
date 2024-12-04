using API.DTOs;
using API.Entities;
using API.Extensions;
using API.Helpers;
using API.Interfaces;
using AutoMapper;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace API.Controllers;

[Authorize]
public class DepartmentsController(IDepartmentRepository departmentRepository, IUserRepository userRepository,
    IMapper mapper) : BaseApiController
{
    [HttpGet]
    public async Task<ActionResult<PagedList<DepartmentDto>>> GetDepartments(
        [FromQuery] DepartmentParams departmentParams)
    {
        var departments = await departmentRepository.GetDepartmentsAsync(departmentParams);
        Response.AddPaginationHeader(departments);
        
        return Ok(departments);
    }

    [HttpGet("{departmentId}")]
    public async Task<ActionResult<DepartmentDto>> GetDepartment(int departmentId)
    {
        var department = await departmentRepository.GetDepartmentDetailedByIdAsync(departmentId);
        if (department == null) return NotFound();

        return Ok(mapper.Map<DepartmentDto>(department));
    }

    [Authorize(Policy = "RequireAdminRole")]
    [HttpPost]
    public async Task<ActionResult<DepartmentDto>> CreateDepartment(DepartmentCreateDto departmentCreateDto)
    {
        var department = mapper.Map<Department>(departmentCreateDto);

        departmentRepository.AddDepartment(department);

        if (await departmentRepository.Complete()) return Ok(mapper.Map<DepartmentDto>(department));
        return BadRequest("Failed to create department");
    }

    [Authorize(Policy = "RequireAdminRole")]
    [HttpPut("{departmentId}")]
    public async Task<ActionResult<DepartmentDto>> EditDepartment(DepartmentCreateDto departmentEditDto, int departmentId)
    {
        var department = await departmentRepository.GetDepartmentByIdAsync(departmentId);
        if (department == null) return NotFound();

        mapper.Map(departmentEditDto, department);

        if (await departmentRepository.Complete()) return Ok(mapper.Map<DepartmentDto>(department));
        return BadRequest("Failed to edit department");
    }

    [Authorize(Policy = "RequireAdminRole")]
    [HttpDelete("{departmentId}")]
    public async Task<ActionResult> DeleteDepartment(int departmentId)
    {
        var department = await departmentRepository.GetDepartmentByIdAsync(departmentId);
        if (department == null) return NotFound();
        
        departmentRepository.DeleteDepartment(department);

        if (await departmentRepository.Complete()) return NoContent();
        return BadRequest("Failed to delete department");
    }

    [Authorize(Policy = "RequireAdminRole")]
    [HttpPost("{departmentId}/add-manager/{managerId}")]
    public async Task<ActionResult> AddManager(int departmentId, int managerId)
    {
        var department = await departmentRepository.GetDepartmentByIdAsync(departmentId);
        if (department == null) return NotFound();

        var manager = await userRepository.GetUserByIdAsync(managerId);
        if (manager == null) return NotFound();
        if (manager.DepartmentId != null)
            return BadRequest($"This person is already manager of '{manager.Department!.Name}' department");
        
        department.Managers.Add(manager);

        if (await departmentRepository.Complete()) return NoContent();
        return BadRequest("Failed to add manager");
    }

    [Authorize(Policy = "RequireAdminRole")]
    [HttpPost("{departmentId}/remove-manager/{managerId}")]
    public async Task<ActionResult> RemoveManager(int departmentId, int managerId)
    {
        var department = await departmentRepository.GetDepartmentByIdAsync(departmentId);
        if (department == null) return NotFound();

        var manager = await userRepository.GetUserByIdAsync(managerId);
        if (manager == null) return NotFound();
        if (manager.DepartmentId != department.Id)
            return BadRequest("This person is not manager of this department");
        
        department.Managers.Remove(manager);

        if (await departmentRepository.Complete()) return NoContent();
        return BadRequest("Failed to remove manager");
    }
}