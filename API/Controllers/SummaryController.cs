using API.DTOs;
using API.Interfaces;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace API.Controllers;

[Authorize(Policy = "RequireManagerRole")]
public class SummaryController(ISummaryRepository summaryRepository) : BaseApiController
{
    [HttpGet]
    public async Task<ActionResult<IEnumerable<SummaryDto>>> GetSymmaries([FromQuery] int employeeId,
        string date)
    {
        var dateAsDateOnly = DateOnly.Parse(date);
        var summaries = await summaryRepository.GetSummaryAsync(employeeId, dateAsDateOnly);
        return Ok(summaries);
    }
}
