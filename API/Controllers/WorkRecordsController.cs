using API.DTOs;
using API.Entities;
using API.Extensions;
using API.Helpers;
using API.Interfaces;
using AutoMapper;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace API.Controllers;

public class WorkRecordsController(IUnitOfWork unitOfWork, IMapper mapper) : BaseApiController
{
    [Authorize]
    [HttpGet]
    public async Task<ActionResult<PagedList<WorkRecordDto>>> GetWorkRecords(
        [FromQuery] WorkRecordParams workRecordParams)
    {
        var workRecords = await unitOfWork.WorkRecordRepository.GetWorkRecordsAsync(workRecordParams);
        Response.AddPaginationHeader(workRecords);

        return Ok(workRecords);
    }

    [Authorize]
    [HttpGet("{workRecordId}")]
    public async Task<ActionResult<WorkRecordDto>> GetWorkRecord(int workRecordId)
    {
        var workRecord = await unitOfWork.WorkRecordRepository.GetWorkRecordByIdAsync(workRecordId);
        if (workRecord == null) return NotFound();

        return Ok(mapper.Map<WorkRecordDto>(workRecord));
    }

    [HttpPost]
    public async Task<ActionResult<WorkRecordDto>> CreateWorkRecord([FromQuery] int employeeId)
    {
        //Todo Cooldown between actions
        var employee = await unitOfWork.EmployeeRepository.GetEmployeeByIdAsync(employeeId);
        if (employee == null) return BadRequest("Failed to find employee");

        var timeNow = DateTime.UtcNow;

        var workRecord = await unitOfWork.WorkRecordRepository.GetLastWorkRecordAsync(employeeId);
        if (workRecord == null || workRecord.End != null)
        {
            var newWorkRecord = new WorkRecord
            {
                Start = timeNow,
                EmployeeId = employeeId
            };
            unitOfWork.WorkRecordRepository.AddWorkRecord(newWorkRecord);
            if (await unitOfWork.Complete()) 
                return Ok(mapper.Map<WorkRecordDto>(newWorkRecord));
        }
        else //workRecord.End == null
        {
            if (timeNow >= workRecord.Start.AddHours(12)) //employee forgot to register leave
            {
                workRecord.End = workRecord.Start.AddHours(8);
                workRecord.MinutesInWork = Math.Ceiling((workRecord.End.Value - workRecord.Start).TotalMinutes);

                var newWorkRecord = new WorkRecord
                {
                    Start = timeNow,
                    EmployeeId = employeeId
                };
                unitOfWork.WorkRecordRepository.AddWorkRecord(newWorkRecord);
                if (await unitOfWork.Complete())
                    return Ok(mapper.Map<WorkRecordDto>(newWorkRecord));
            }
            else //employee left normally
            {
                workRecord.End = timeNow;
                workRecord.MinutesInWork = Math.Ceiling((workRecord.End.Value - workRecord.Start).TotalMinutes);
                if (await unitOfWork.Complete())
                    return Ok(mapper.Map<WorkRecordDto>(workRecord));
            }
        }

        return BadRequest("Failed to create work record");
    }

    [Authorize(Policy = "RequireAdminRole")]
    [HttpPut("{workRecordId}")]
    public async Task<ActionResult<WorkRecordDto>> EditWorkRecord(WorkRecordEditDto workRecordEditDto, int workRecordId)
    {
        var workRecord = await unitOfWork.WorkRecordRepository.GetWorkRecordByIdAsync(workRecordId);
        if (workRecord == null) return BadRequest("Failed to find work record");

        mapper.Map(workRecordEditDto, workRecord);
        workRecord.MinutesInWork = Math.Ceiling((workRecord.End!.Value - workRecord.Start).TotalMinutes);

        if (workRecord.Start > workRecord.End)
            return BadRequest("Start date cannot be later than end date");
        if (workRecord.Start.AddHours(14) < workRecord.End)
            return BadRequest("Work record cannot last longer than 14 hours");

        if (await unitOfWork.Complete()) return Ok(mapper.Map<WorkRecordDto>(workRecord));
        return BadRequest("Failed to edit work record");
    }

    [Authorize(Policy = "RequireAdminRole")]
    [HttpDelete("{workRecordId}")]
    public async Task<ActionResult> DeleteWorkRecord(int workRecordId)
    {
        var workRecord = await unitOfWork.WorkRecordRepository.GetWorkRecordByIdAsync(workRecordId);
        if (workRecord == null) return BadRequest("Failed to find work record");
        
        unitOfWork.WorkRecordRepository.DeleteWorkRecord(workRecord);

        if (await unitOfWork.Complete()) return NoContent();
        return BadRequest("Failed to delete work record");
    }
}