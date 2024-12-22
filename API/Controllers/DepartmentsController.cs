using API.DTOs;
using API.Entities;
using API.Extensions;
using API.Helpers;
using API.Interfaces;
using AutoMapper;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Mvc;

namespace API.Controllers;

[Authorize]
public class DepartmentsController(IUnitOfWork unitOfWork, IMapper mapper, 
    UserManager<AppUser> userManager) : BaseApiController
{
    [HttpGet]
    public async Task<ActionResult<PagedList<DepartmentDto>>> GetDepartments(
        [FromQuery] DepartmentParams departmentParams)
    {
        var departments = await unitOfWork.DepartmentRepository.GetDepartmentsAsync(departmentParams);
        Response.AddPaginationHeader(departments);
        
        return Ok(departments);
    }

    [HttpGet("{departmentId}")]
    public async Task<ActionResult<DepartmentDto>> GetDepartment(int departmentId)
    {
        var department = await unitOfWork.DepartmentRepository.GetDepartmentDetailedByIdAsync(departmentId);
        if (department == null) return NotFound();

        return Ok(mapper.Map<DepartmentDto>(department));
    }

    [Authorize(Policy = "RequireAdminRole")]
    [HttpPost]
    public async Task<ActionResult<DepartmentDto>> CreateDepartment(DepartmentCreateDto departmentCreateDto)
    {
        var department = mapper.Map<Department>(departmentCreateDto);

        unitOfWork.DepartmentRepository.AddDepartment(department);

        if (await unitOfWork.Complete()) return Ok(mapper.Map<DepartmentDto>(department));
        return BadRequest("Failed to create department");
    }

    [Authorize(Policy = "RequireAdminRole")]
    [HttpPut("{departmentId}")]
    public async Task<ActionResult<DepartmentDto>> EditDepartment(DepartmentCreateDto departmentEditDto, int departmentId)
    {
        var department = await unitOfWork.DepartmentRepository.GetDepartmentDetailedByIdAsync(departmentId);
        if (department == null) return BadRequest("Failed to find department");

        CreateNotifications(department.Managers, $"Department {department.Name} has been edited",
            $"Department {department.Name} has been renamed into {departmentEditDto.Name}");

        mapper.Map(departmentEditDto, department);

        if (await unitOfWork.Complete()) return Ok(mapper.Map<DepartmentDto>(department));
        return BadRequest("Failed to edit department");
    }

    [Authorize(Policy = "RequireAdminRole")]
    [HttpDelete("{departmentId}")]
    public async Task<ActionResult> DeleteDepartment(int departmentId)
    {
        var department = await unitOfWork.DepartmentRepository.GetDepartmentDetailedByIdAsync(departmentId);
        if (department == null) return BadRequest("Failed to find department");

        CreateNotifications(department.Managers, $"Department {department.Name} has been deleted",
            $"Department {department.Name} has been deleted, for more information contact system administrator");
        
        unitOfWork.DepartmentRepository.DeleteDepartment(department);

        if (await unitOfWork.Complete()) return NoContent();
        return BadRequest("Failed to delete department");
    }

    [Authorize(Policy = "RequireAdminRole")]
    [HttpPost("{departmentId}/add-manager/{managerId}")]
    public async Task<ActionResult> AddManager(int departmentId, int managerId)
    {
        var department = await unitOfWork.DepartmentRepository.GetDepartmentDetailedByIdAsync(departmentId);
        if (department == null) return BadRequest("Failed to find department");

        var manager = await unitOfWork.UserRepository.GetUserDetailedByIdAsync(managerId);
        if (manager == null) return BadRequest("Failed to find manager");
        if (manager.DepartmentId != null)
            return BadRequest($"This person is already manager of '{manager.Department!.Name}' department");
        
        department.Managers.Add(manager);

        CreateNotifications(department.Managers, $"Department {department.Name} got new manager",
            $"Department {department.Name} got new manager - {manager.FirstName} {manager.LastName}");

        if (await unitOfWork.Complete())
        {
            await userManager.AddToRoleAsync(manager, "Manager");
            await userManager.RemoveFromRoleAsync(manager, "User");
            return NoContent();
        }
        return BadRequest("Failed to add manager");
    }

    [Authorize(Policy = "RequireAdminRole")]
    [HttpPost("{departmentId}/remove-manager/{managerId}")]
    public async Task<ActionResult> RemoveManager(int departmentId, int managerId)
    {
        var department = await unitOfWork.DepartmentRepository.GetDepartmentDetailedByIdAsync(departmentId);
        if (department == null) return BadRequest("Failed to find department");

        var manager = await unitOfWork.UserRepository.GetUserByIdAsync(managerId);
        if (manager == null) return BadRequest("Failed to find manager");
        if (manager.DepartmentId != department.Id)
            return BadRequest("This person is not manager of this department");
        
        CreateNotifications(department.Managers, $"Department {department.Name} lost manager",
            $"Department {department.Name} lost manager - {manager.FirstName} {manager.LastName}");

        department.Managers.Remove(manager);

        if (await unitOfWork.Complete())
        {
            await userManager.AddToRoleAsync(manager, "User");
            await userManager.RemoveFromRoleAsync(manager, "Manager");
            return NoContent();
        }
        return BadRequest("Failed to remove manager");
    }

    private void CreateNotifications(IEnumerable<AppUser> users, string title, string content)
    {
        foreach (var user in users)
        {
            var notification = new Notification
            {
                Title = title,
                Content = content,
                UserId = user.Id
            };

            unitOfWork.NotificationRepository.AddNotification(notification);
        }
    }
}