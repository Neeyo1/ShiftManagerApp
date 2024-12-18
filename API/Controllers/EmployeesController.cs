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
public class EmployeesController(IUnitOfWork unitOfWork, IMapper mapper) : BaseApiController
{
    [HttpGet]
    public async Task<ActionResult<PagedList<EmployeeDto>>> GetEmployees(
        [FromQuery] EmployeeParams employeeParams)
    {
        var employees = await unitOfWork.EmployeeRepository.GetEmployeesAsync(employeeParams);
        Response.AddPaginationHeader(employees);
        
        return Ok(employees);
    }

    [HttpGet("{employeeId}")]
    public async Task<ActionResult<EmployeeDto>> GetEmployee(int employeeId)
    {
        var employee = await unitOfWork.EmployeeRepository.GetEmployeeByIdAsync(employeeId);
        if (employee == null) return NotFound();

        return Ok(mapper.Map<EmployeeDto>(employee));
    }

    [Authorize(Policy = "RequireAdminRole")]
    [HttpPost]
    public async Task<ActionResult<EmployeeDto>> CreateEmployee(EmployeeCreateDto employeeCreateDto)
    {
        var employee = mapper.Map<Employee>(employeeCreateDto);

        unitOfWork.EmployeeRepository.AddEmployee(employee);

        if (await unitOfWork.Complete()) return Ok(mapper.Map<EmployeeDto>(employee));
        return BadRequest("Failed to create employee");
    }

    [Authorize(Policy = "RequireAdminRole")]
    [HttpPut("{employeeId}")]
    public async Task<ActionResult<EmployeeDto>> EditEmployee(EmployeeCreateDto employeeEditDto, int employeeId)
    {
        var employee = await unitOfWork.EmployeeRepository.GetEmployeeByIdAsync(employeeId);
        if (employee == null) return BadRequest("Failed to find employee");

        mapper.Map(employeeEditDto, employee);

        if (await unitOfWork.Complete()) return Ok(mapper.Map<EmployeeDto>(employee));
        return BadRequest("Failed to edit employee");
    }

    [Authorize(Policy = "RequireAdminRole")]
    [HttpDelete("{employeeId}")]
    public async Task<ActionResult> DeleteEmployee(int employeeId)
    {
        var employee = await unitOfWork.EmployeeRepository.GetEmployeeByIdAsync(employeeId);
        if (employee == null) return BadRequest("Failed to find employee");
        
        unitOfWork.EmployeeRepository.DeleteEmployee(employee);

        if (await unitOfWork.Complete()) return NoContent();
        return BadRequest("Failed to delete employee");
    }

    [Authorize(Policy = "RequireAdminRole")]
    [HttpPost("{employeeId}/active")]
    public async Task<ActionResult<EmployeeDto>> ActiveEmployee(int employeeId)
    {
        var employee = await unitOfWork.EmployeeRepository.GetEmployeeByIdAsync(employeeId);
        if (employee == null) return BadRequest("Failed to find employee");

        if (employee.IsActive == true) return BadRequest("This employee is already activated");
        employee.IsActive = true;

        if (await unitOfWork.Complete()) return Ok(mapper.Map<EmployeeDto>(employee));
        return BadRequest("Failed to active employee");
    }

    [Authorize(Policy = "RequireAdminRole")]
    [HttpPost("{employeeId}/deactive")]
    public async Task<ActionResult<EmployeeDto>> DeactiveEmployee(int employeeId)
    {
        var employee = await unitOfWork.EmployeeRepository.GetEmployeeByIdAsync(employeeId);
        if (employee == null) return BadRequest("Failed to find employee");

        if (employee.IsActive == false) return BadRequest("This employee is not activated yet");
        employee.IsActive = false;

        if (await unitOfWork.Complete()) return Ok(mapper.Map<EmployeeDto>(employee));
        return BadRequest("Failed to deactive employee");
    }
}