using API.DTOs;
using API.Helpers;
using API.Interfaces;
using AutoMapper;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace API.Controllers;

[Authorize(Policy = "RequireManagerRole")]
public class SummaryController(IUnitOfWork unitOfWork, IMapper mapper) : BaseApiController
{
    [HttpGet("month")]
    public async Task<ActionResult<SummaryDto>> GetSummaryInMonth(
        [FromQuery] int employeeId, int month, int year)
    {
        var dateFrom = new DateOnly(year, month, 1);
        var dateTo = new DateOnly(year, month, DateTime.DaysInMonth(year, month));

        var workDetails = await unitOfWork.SummaryRepository.GetSummaryWorkDetailsAsync(employeeId, 
            dateFrom, dateTo);

        var summary = new Summary
        {
            SummaryWorkDetails = workDetails
        };

        return Ok(mapper.Map<SummaryDto>(summary));
    }
}
