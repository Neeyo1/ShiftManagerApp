using API.DTOs;
using API.Entities;

namespace API.Interfaces;

public interface IWorkRecordRepository
{
    void AddWorkRecord(WorkRecord workRecord);
    void DeleteWorkRecord(WorkRecord workRecord);
    Task<IEnumerable<WorkRecordDto>> GetWorkRecordsAsync();
    Task<WorkRecord?> GetWorkRecordByIdAsync(int workRecordId);
    Task<WorkRecord?> GetLastWorkRecordAsync(int employeeId);
    Task<IEnumerable<WorkRecordDto>> GetWorkRecordsByEmployeeAndDateAsync(int employeeId, DateTime dateStart, DateTime dateEnd);
    Task<bool> Complete();
}
