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

        if (workShiftParams.WorkShiftId != null)
        {
            query = query.Where(x => x.Id == workShiftParams.WorkShiftId);
        }

        if (workShiftParams.EmployeeId != null)
        {
            query = query.Where(x => x.EmployeeId == workShiftParams.EmployeeId);
        }

        if (workShiftParams.DateFrom != null)
        {
            var dateFrom = DateOnly.Parse(workShiftParams.DateFrom);
            
            query = query.Where(x => x.Date >= dateFrom);
        }

        if (workShiftParams.DateTo != null)
        {
            var dateTo = DateOnly.Parse(workShiftParams.DateTo);
            
            query = query.Where(x => x.Date <= dateTo);
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
}
