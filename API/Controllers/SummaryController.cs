using API.DTOs;
using API.Interfaces;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace API.Controllers;

[Authorize(Policy = "RequireManagerRole")]
public class SummaryController(IUnitOfWork unitOfWork) : BaseApiController
{
    [HttpGet]
    public async Task<ActionResult<IEnumerable<SummaryDto>>> GetSymmaries([FromQuery] int employeeId,
        string date)
    {
        var dateAsDateOnly = DateOnly.Parse(date);
        var summaries = await unitOfWork.SummaryRepository.GetSummaryAsync(employeeId, dateAsDateOnly);
        return Ok(summaries);
    }
}
