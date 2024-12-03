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

        CreateMap<string, DateOnly>().ConvertUsing(s => DateOnly.Parse(s));
        CreateMap<DateTime, DateTime>().ConvertUsing(d => DateTime.SpecifyKind(d, DateTimeKind.Utc));
        CreateMap<DateTime?, DateTime?>().ConvertUsing(d => d.HasValue 
            ? DateTime.SpecifyKind(d.Value, DateTimeKind.Utc) : null);
    }
}
