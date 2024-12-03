using API.DTOs;
using API.Entities;
using API.Interfaces;
using AutoMapper;
using AutoMapper.QueryableExtensions;
using Microsoft.EntityFrameworkCore;

namespace API.Data;

public class WorkShiftRepository(DataContext context, IMapper mapper) : IWorkShiftRepository
{
    public void AddWorkShift(WorkShift workShift)
    {
        context.WorkShifts.Add(workShift);
    }

    public void DeleteWorkShift(WorkShift workShift)
    {
        context.WorkShifts.Remove(workShift);
    }

    public async Task<IEnumerable<WorkShiftDto>> GetWorkShiftsAsync()
    {
        return await context.WorkShifts
            .ProjectTo<WorkShiftDto>(mapper.ConfigurationProvider)
            .ToListAsync();
    }

    public async Task<WorkShift?> GetWorkShiftByIdAsync(int workShiftId)
    {
        return await context.WorkShifts
            .FindAsync(workShiftId);
    }

    public async Task<WorkShift?> GetWorkShiftByEmployeeAndDate(int employeeId, DateOnly date)
    {
        return await context.WorkShifts
            .FirstOrDefaultAsync(x => x.EmployeeId == employeeId && x.Date == date);
    }

    public async Task<bool> Complete()
    {
        return await context.SaveChangesAsync() > 0;
    }
}
