using API.DTOs;
using API.Entities;
using API.Helpers;
using API.Interfaces;
using AutoMapper;
using AutoMapper.QueryableExtensions;
using Microsoft.EntityFrameworkCore;

namespace API.Data;

public class WorkRecordRepository(DataContext context, IMapper mapper) : IWorkRecordRepository
{
    public void AddWorkRecord(WorkRecord workRecord)
    {
        context.WorkRecords.Add(workRecord);
    }

    public void DeleteWorkRecord(WorkRecord workRecord)
    {
        context.WorkRecords.Remove(workRecord);
    }

    public async Task<PagedList<WorkRecordDto>> GetWorkRecordsAsync(WorkRecordParams workRecordParams)
    {
        var query = context.WorkRecords.AsQueryable();

        if (workRecordParams.WorkRecordId != 0)
        {
            query = query.Where(x => x.Id == workRecordParams.WorkRecordId);
        }

        if (workRecordParams.EmployeeId != 0)
        {
            query = query.Where(x => x.EmployeeId == workRecordParams.EmployeeId);
        }

        if (workRecordParams.DateFrom != null)
        {
            var dateFrom = DateTime.SpecifyKind(DateTime.Parse(workRecordParams.DateFrom), 
                DateTimeKind.Utc);
            
            query = query.Where(x => x.Start >= dateFrom);
        }

        if (workRecordParams.DateTo != null)
        {
            var dateTo = DateTime.SpecifyKind(DateTime.Parse(workRecordParams.DateTo), 
                DateTimeKind.Utc);
            
            query = query.Where(x => x.Start <= dateTo);
        }

        query = workRecordParams.Status switch
        {
            "going" => query.Where(x => x.MinutesInWork == 0),
            "closed" => query.Where(x => x.MinutesInWork > 0),
            _ => query
        };

        query = workRecordParams.OrderBy switch
        {
            "oldest" => query.OrderBy(x => x.Id),
            "newest" => query.OrderByDescending(x => x.Id),
            "longest" => query.OrderByDescending(x => x.MinutesInWork),
            "shortest" => query.OrderBy(x => x.MinutesInWork),
            _ => query.OrderBy(x => x.Id),
        };

        return await PagedList<WorkRecordDto>.CreateAsync(
            query.ProjectTo<WorkRecordDto>(mapper.ConfigurationProvider), 
            workRecordParams.PageNumber, workRecordParams.PageSize);
    }

    public async Task<WorkRecord?> GetWorkRecordByIdAsync(int workRecordId)
    {
        return await context.WorkRecords
            .FindAsync(workRecordId);
    }

    public async Task<WorkRecord?> GetLastWorkRecordAsync(int employeeId)
    {
        return await context.WorkRecords
            .OrderByDescending(x => x.Start)
            .FirstOrDefaultAsync(x => x.EmployeeId == employeeId);
    }

    public async Task<IEnumerable<WorkRecordDto>> GetWorkRecordsByEmployeeAndDateAsync(int employeeId,
        DateTime dateStart, DateTime dateEnd)
    {
        return await context.WorkRecords
            .Where(x => x.EmployeeId == employeeId && x.Start >= dateStart && x.Start <= dateEnd)
            .ProjectTo<WorkRecordDto>(mapper.ConfigurationProvider)
            .ToListAsync();
    }
    public async Task<bool> Complete()
    {
        return await context.SaveChangesAsync() > 0;
    }
}
