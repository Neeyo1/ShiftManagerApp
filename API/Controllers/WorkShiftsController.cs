using API.DTOs;
using API.Entities;
using API.Interfaces;
using AutoMapper;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace API.Controllers;

[Authorize]
public class WorkShiftsController(IWorkShiftRepository workShiftRepository, IMapper mapper,
    IEmployeeRepository employeeRepository) : BaseApiController
{
    [HttpGet]
    public async Task<ActionResult<IEnumerable<WorkShiftDto>>> GetWorkShifts()
    {
        var workShifts = await workShiftRepository.GetWorkShiftsAsync();
        return Ok(workShifts);
    }

    [HttpGet("{workShiftId}")]
    public async Task<ActionResult<WorkShiftDto>> GetWorkShift(int workShiftId)
    {
        var workShift = await workShiftRepository.GetWorkShiftByIdAsync(workShiftId);
        if (workShift == null) return NotFound();

        return Ok(mapper.Map<WorkShiftDto>(workShift));
    }

    [Authorize(Policy = "RequireManagerRole")]
    [HttpPost]
    public async Task<ActionResult<WorkShiftDto>> CreateWorkShift(WorkShiftCreateDto workShiftCreateDto)
    {
        var today = DateOnly.FromDateTime(DateTime.Now);
        var dateFrom = DateOnly.Parse(workShiftCreateDto.DateFrom);
        var dateTo = DateOnly.Parse(workShiftCreateDto.DateTo);
        var hourStart = TimeOnly.Parse(workShiftCreateDto.Start);

        if (dateFrom > dateTo || dateFrom < today || dateTo > today.AddDays(40))
            return BadRequest("Dates validation error");

        var employee = await employeeRepository.GetEmployeeByIdAsync(workShiftCreateDto.EmployeeId);
        if (employee == null) return NotFound();

        for (var date = dateFrom; date <= dateTo; date = date.AddDays(1))
        {
            var workShift = await workShiftRepository.GetWorkShiftByEmployeeAndDateAsync(employee.Id, date);
            if (workShift != null) continue;

            var start = new DateTime(date, hourStart).ToUniversalTime();
            var newWorkShift = new WorkShift
            {
                Date = date,
                Start = start,
                End = start.AddHours(workShiftCreateDto.ShiftLength),
                EmployeeId = workShiftCreateDto.EmployeeId
            };
            workShiftRepository.AddWorkShift(newWorkShift);
        }

        if (await workShiftRepository.Complete()) return NoContent();
        return BadRequest("Failed to create work shift");
    }

    [Authorize(Policy = "RequireManagerRole")]
    [HttpPut("{workShiftId}")]
    public async Task<ActionResult<WorkShiftDto>> EditWorkShift(WorkShiftEditDto workShiftEditDto, int workShiftId)
    {
        var workShift = await workShiftRepository.GetWorkShiftByIdAsync(workShiftId);
        if (workShift == null) return NotFound();

        var hourStart = TimeOnly.Parse(workShiftEditDto.Start);
        var start = new DateTime(workShift.Date, hourStart).ToUniversalTime();

        workShift.Start = start;
        workShift.End = start.AddHours(workShiftEditDto.ShiftLength);

        if (await workShiftRepository.Complete()) return Ok(mapper.Map<WorkShiftDto>(workShift));
        return BadRequest("Failed to edit work shift");
    }

    [Authorize(Policy = "RequireManagerRole")]
    [HttpDelete("{workShiftId}")]
    public async Task<ActionResult> DeleteWorkShift(int workShiftId)
    {
        var workShift = await workShiftRepository.GetWorkShiftByIdAsync(workShiftId);
        if (workShift == null) return NotFound();
        
        workShiftRepository.DeleteWorkShift(workShift);

        if (await workShiftRepository.Complete()) return NoContent();
        return BadRequest("Failed to delete work shift");
    }
}