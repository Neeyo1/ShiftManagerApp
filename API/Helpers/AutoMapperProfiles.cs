using API.DTOs;
using API.Entities;
using AutoMapper;

namespace API.Helpers;

public class AutoMapperProfiles : Profile
{
    public AutoMapperProfiles()
    {
        CreateMap<AppUser, UserDto>();
        CreateMap<RegisterDto, AppUser>();
        CreateMap<LoginDto, AppUser>();
        CreateMap<Department, DepartmentDto>()
            .ForMember(x => x.EmployeeCount, y => y.MapFrom(z => z.Employees.Where(a => a.IsActive == true).Count()));
        CreateMap<DepartmentCreateDto, Department>();
        CreateMap<AppUser, ManagerDto>();
        CreateMap<Employee, EmployeeDto>();
        CreateMap<EmployeeCreateDto, Employee>();
        CreateMap<WorkShift, WorkShiftDto>();
        CreateMap<WorkShiftCreateDto, WorkShift>();
        CreateMap<WorkShiftEditDto, WorkShift>();
        CreateMap<WorkRecord, WorkRecordDto>();
        CreateMap<WorkRecordEditDto, WorkRecord>();
        CreateMap<SummaryWorkDetail, SummaryWorkDetailDto>();
        CreateMap<Summary, SummaryDto>()
            .ForMember(x => x.Employee, y => y.MapFrom(z => z.SummaryWorkDetails.Any()
            ? z.SummaryWorkDetails.First().Employee : null))
            .ForMember(x => x.TotalWorkRecordMinutes, y => y.MapFrom(z => z.SummaryWorkDetails
                .Select(s => s.WorkRecordMinutes).Sum()))
            .ForMember(x => x.TotalWorkShiftMinutes, y => y.MapFrom(z => z.SummaryWorkDetails
                .Select(s => s.WorkShiftMinutes).Sum()));
        CreateMap<Notification, NotificationDto>();
        CreateMap<Notification, NotificationDetailedDto>();
        CreateMap<AppUser, MemberDto>()
            .ForMember(x => x.Role, y => y.MapFrom(z => z.UserRoles.Select(a => a.Role).FirstOrDefault()));

        CreateMap<string, DateOnly>().ConvertUsing(s => DateOnly.Parse(s));
        CreateMap<string, TimeOnly>().ConvertUsing(s => TimeOnly.Parse(s));
        CreateMap<DateTime, DateTime>().ConvertUsing(d => DateTime.SpecifyKind(d, DateTimeKind.Utc));
        CreateMap<DateTime?, DateTime?>().ConvertUsing(d => d.HasValue 
            ? DateTime.SpecifyKind(d.Value, DateTimeKind.Utc) : null);
    }
}
