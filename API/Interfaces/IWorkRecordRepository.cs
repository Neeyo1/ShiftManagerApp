using API.DTOs;
using API.Entities;
using API.Helpers;

namespace API.Interfaces;

public interface IWorkRecordRepository
{
    void AddWorkRecord(WorkRecord workRecord);
    void DeleteWorkRecord(WorkRecord workRecord);
    Task<PagedList<WorkRecordDto>> GetWorkRecordsAsync(WorkRecordParams workRecordParams);
    Task<WorkRecord?> GetWorkRecordByIdAsync(int workRecordId);
    Task<WorkRecord?> GetLastWorkRecordAsync(int employeeId);
    Task<IEnumerable<WorkRecordDto>> GetWorkRecordsByEmployeeAndDateAsync(int employeeId, DateTime dateStart, DateTime dateEnd);
}
