using API.DTOs;
using API.Helpers;
using API.Interfaces;
using AutoMapper;
using AutoMapper.QueryableExtensions;
using Microsoft.EntityFrameworkCore;

namespace API.Data;

public class SummaryRepository(DataContext context, IMapper mapper) : ISummaryRepository
{
    public async Task<SummaryDto?> GetSummaryAsync(int employeeId, DateOnly date)
    {
        return await context.Employees
            .Where(x => x.Id == employeeId)
            .Select(x => new Summary{
                Employee = x,
                Date = date,
                WorkShiftMinutes = x.WorkShifts.FirstOrDefault(y => y.Date == date) == null
                    ? 0
                    : x.WorkShifts.FirstOrDefault(y => y.Date == date)!.End.Subtract(
                        x.WorkShifts.FirstOrDefault(y => y.Date == date)!.Start).TotalMinutes,
                WorkRecordMinutes = x.WorkRecords
                    .Where(y => y.Start >= x.WorkShifts
                        .FirstOrDefault(z => z.Date == date)!.Start.AddHours(-2)
                        || y.Start >= x.WorkShifts
                        .FirstOrDefault(z => z.Date == date)!.End.AddHours(2))
                    .Sum(z => z.MinutesInWork),
                WorkShift = x.WorkShifts
                    .FirstOrDefault(y => y.Date == date),
                WorkRecords = x.WorkRecords
                    .Where(y => y.Start >= x.WorkShifts
                        .FirstOrDefault(z => z.Date == date)!.Start.AddHours(-2)
                        || y.Start >= x.WorkShifts
                        .FirstOrDefault(z => z.Date == date)!.End.AddHours(2))
                
            })
            .ProjectTo<SummaryDto>(mapper.ConfigurationProvider)
            .FirstOrDefaultAsync();
    }
}
