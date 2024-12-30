using API.DTOs;
using API.Helpers;

namespace API.Interfaces;

public interface ISummaryRepository
{
    Task<SummaryWorkDetail?> GetSummaryWorkDetailAsync(int employeeId, DateOnly date);
    Task<IEnumerable<SummaryWorkDetail>> GetSummaryWorkDetailsAsync(int employeeId, 
        DateOnly dateFrom, DateOnly dateTo);
}
