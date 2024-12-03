using API.DTOs;
using API.Entities;
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

    public async Task<IEnumerable<WorkRecordDto>> GetWorkRecordsAsync()
    {
        return await context.WorkRecords
            .ProjectTo<WorkRecordDto>(mapper.ConfigurationProvider)
            .ToListAsync();
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
