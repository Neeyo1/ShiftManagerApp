using API.DTOs;

namespace API.Interfaces;

public interface ISummaryRepository
{
    Task<SummaryDto?> GetSummaryAsync(int employeeId, DateOnly date);
}
