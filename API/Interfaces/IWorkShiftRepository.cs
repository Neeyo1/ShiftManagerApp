using API.DTOs;
using API.Entities;

namespace API.Interfaces;

public interface IWorkShiftRepository
{
    void AddWorkShift(WorkShift workShift);
    void DeleteWorkShift(WorkShift workShift);
    Task<IEnumerable<WorkShiftDto>> GetWorkShiftsAsync();
    Task<WorkShift?> GetWorkShiftByIdAsync(int workShiftId);
    Task<WorkShift?> GetWorkShiftByEmployeeAndDate(int employeeId, DateOnly date);
    Task<bool> Complete();
}
