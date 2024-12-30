using API.Helpers;
using API.Interfaces;
using Microsoft.EntityFrameworkCore;

namespace API.Data;

public class SummaryRepository(DataContext context) : ISummaryRepository
{
    public async Task<SummaryWorkDetail?> GetSummaryWorkDetailAsync(int employeeId, DateOnly date)
    {
        return await context.Employees
            .Where(x => x.Id == employeeId)
            .Select(x => new SummaryWorkDetail{
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
                    .FirstOrDefault(y => y.Date == date)
            })
            .FirstOrDefaultAsync();
    }

    public async Task<IEnumerable<SummaryWorkDetail>> GetSummaryWorkDetailsAsync(int employeeId,
        DateOnly dateFrom, DateOnly dateTo)
    {
        IEnumerable<SummaryWorkDetail> workDetails = [];

        for (var date = dateFrom; date <= dateTo; date = date.AddDays(1))
        {
            var workDetail = await GetSummaryWorkDetailAsync(employeeId, date);
            if (workDetail != null && (workDetail.WorkShiftMinutes != 0 || workDetail.WorkRecordMinutes != 0)) 
                workDetails = workDetails.Append(workDetail);
        }

        return workDetails;
    }
}
