using API.DTOs;
using API.Entities;
using API.Helpers;
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

    public async Task<PagedList<WorkShiftDto>> GetWorkShiftsAsync(WorkShiftParams workShiftParams)
    {
        var query = context.WorkShifts.AsQueryable();

        if (workShiftParams.WorkShiftId != 0)
        {
            query = query.Where(x => x.Id == workShiftParams.WorkShiftId);
        }

        if (workShiftParams.EmployeeId != 0)
        {
            query = query.Where(x => x.EmployeeId == workShiftParams.EmployeeId);
        }

        if (workShiftParams.Date != null)
        {
            var date = DateOnly.Parse(workShiftParams.Date);
            
            query = query.Where(x => x.Date == date);
        }

        if (workShiftParams.DateFrom != null)
        {
            var dateFrom = DateTime.SpecifyKind(DateTime.Parse(workShiftParams.DateFrom), 
                DateTimeKind.Utc);
            
            query = query.Where(x => x.Start >= dateFrom);
        }

        if (workShiftParams.DateTo != null)
        {
            var dateTo = DateTime.SpecifyKind(DateTime.Parse(workShiftParams.DateTo), 
                DateTimeKind.Utc);
            
            query = query.Where(x => x.Start <= dateTo);
        }

        query = workShiftParams.Status switch
        {
            "going" => query.Where(x => x.End > DateTime.UtcNow),
            "closed" => query.Where(x => x.End <= DateTime.UtcNow),
            _ => query
        };

        query = workShiftParams.OrderBy switch
        {
            "oldest" => query.OrderBy(x => x.Start),
            "newest" => query.OrderByDescending(x => x.Start),
            _ => query.OrderBy(x => x.Id),
        };

        return await PagedList<WorkShiftDto>.CreateAsync(
            query.ProjectTo<WorkShiftDto>(mapper.ConfigurationProvider), 
            workShiftParams.PageNumber, workShiftParams.PageSize);
    }

    public async Task<WorkShift?> GetWorkShiftByIdAsync(int workShiftId)
    {
        return await context.WorkShifts
            .FindAsync(workShiftId);
    }

    public async Task<WorkShift?> GetWorkShiftByEmployeeAndDateAsync(int employeeId, DateOnly date)
    {
        return await context.WorkShifts
            .FirstOrDefaultAsync(x => x.EmployeeId == employeeId && x.Date == date);
    }

    public async Task<bool> Complete()
    {
        return await context.SaveChangesAsync() > 0;
    }
}
