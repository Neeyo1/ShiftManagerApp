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
public class WorkShiftsController(IUnitOfWork unitOfWork, IMapper mapper) : BaseApiController
{
    [HttpGet]
    public async Task<ActionResult<PagedList<WorkShiftDto>>> GetWorkShifts(
        [FromQuery] WorkShiftParams workShiftParams)
    {
        var workShifts = await unitOfWork.WorkShiftRepository.GetWorkShiftsAsync(workShiftParams);
        Response.AddPaginationHeader(workShifts);
        
        return Ok(workShifts);
    }

    [HttpGet("{workShiftId}")]
    public async Task<ActionResult<WorkShiftDto>> GetWorkShift(int workShiftId)
    {
        var workShift = await unitOfWork.WorkShiftRepository.GetWorkShiftByIdAsync(workShiftId);
        if (workShift == null) return NotFound();

        return Ok(mapper.Map<WorkShiftDto>(workShift));
    }

    [Authorize(Policy = "RequireManagerRole")]
    [HttpPost]
    public async Task<ActionResult<WorkShiftDto>> CreateWorkShift(WorkShiftCreateDto workShiftCreateDto)
    {
        var employee = await unitOfWork.EmployeeRepository.GetEmployeeByIdAsync(workShiftCreateDto.EmployeeId);
        if (employee == null) return BadRequest("Failed to find employee");

        var today = DateOnly.FromDateTime(DateTime.Now);
        var dateFrom = DateOnly.Parse(workShiftCreateDto.DateFrom);
        var dateTo = DateOnly.Parse(workShiftCreateDto.DateTo);
        var hourStart = TimeOnly.Parse(workShiftCreateDto.Start);

        if (dateFrom > dateTo)
            return BadRequest("Date from cannot be later than date to");
        if (dateFrom < today)
            return BadRequest("You cannot create shifts for days in the past");
        if (dateTo > today.AddDays(40))
            return BadRequest("You cannot create shifts for more than 40 days in the future");

        for (var date = dateFrom; date <= dateTo; date = date.AddDays(1))
        {
            var workShift = await unitOfWork.WorkShiftRepository.GetWorkShiftByEmployeeAndDateAsync(employee.Id, date);
            if (workShift != null) continue;

            var start = DateTime.SpecifyKind(new DateTime(date, hourStart), DateTimeKind.Utc);
            //TODO Use client timezone to properly set new datetime
            var newWorkShift = new WorkShift
            {
                Date = date,
                Start = start,
                End = start.AddHours(workShiftCreateDto.ShiftLength),
                EmployeeId = workShiftCreateDto.EmployeeId
            };
            unitOfWork.WorkShiftRepository.AddWorkShift(newWorkShift);
        }

        if (await unitOfWork.Complete()) return NoContent();
        return BadRequest("Failed to create work shift");
    }

    [Authorize(Policy = "RequireManagerRole")]
    [HttpPut("{workShiftId}")]
    public async Task<ActionResult<WorkShiftDto>> EditWorkShift(WorkShiftEditDto workShiftEditDto, int workShiftId)
    {
        var workShift = await unitOfWork.WorkShiftRepository.GetWorkShiftByIdAsync(workShiftId);
        if (workShift == null) return BadRequest("Failed to find work shift");

        mapper.Map(workShiftEditDto, workShift);

        workShift.End = workShift.Start.AddHours(workShiftEditDto.ShiftLength);

        if (await unitOfWork.Complete()) return Ok(mapper.Map<WorkShiftDto>(workShift));
        return BadRequest("Failed to edit work shift");
    }

    [Authorize(Policy = "RequireManagerRole")]
    [HttpDelete("{workShiftId}")]
    public async Task<ActionResult> DeleteWorkShift(int workShiftId)
    {
        var workShift = await unitOfWork.WorkShiftRepository.GetWorkShiftByIdAsync(workShiftId);
        if (workShift == null) return BadRequest("Failed to find work shift");
        
        unitOfWork.WorkShiftRepository.DeleteWorkShift(workShift);

        if (await unitOfWork.Complete()) return NoContent();
        return BadRequest("Failed to delete work shift");
    }
}