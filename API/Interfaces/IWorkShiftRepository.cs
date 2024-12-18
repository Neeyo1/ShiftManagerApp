using API.DTOs;
using API.Entities;
using API.Helpers;

namespace API.Interfaces;

public interface IWorkShiftRepository
{
    void AddWorkShift(WorkShift workShift);
    void DeleteWorkShift(WorkShift workShift);
    Task<PagedList<WorkShiftDto>> GetWorkShiftsAsync(WorkShiftParams workShiftParams);
    Task<WorkShift?> GetWorkShiftByIdAsync(int workShiftId);
    Task<WorkShift?> GetWorkShiftByEmployeeAndDateAsync(int employeeId, DateOnly date);
}
