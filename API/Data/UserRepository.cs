using API.DTOs;
using API.Entities;
using API.Helpers;
using API.Interfaces;
using AutoMapper;
using AutoMapper.QueryableExtensions;
using Microsoft.EntityFrameworkCore;

namespace API.Data;

public class UserRepository(DataContext context, IMapper mapper) : IUserRepository
{
    public async Task<IEnumerable<AppUser>> GetUsersAsync()
    {
        return await context.Users
            .ToListAsync();
    }

    public async Task<AppUser?> GetUserByIdAsync(int userId)
    {
        return await context.Users
            .FindAsync(userId);
    }

    public async Task<AppUser?> GetUserByUsernameAsync(string username)
    {
        return await context.Users
            .SingleOrDefaultAsync(x => x.UserName == username);
    }

    public async Task<AppUser?> GetUserDetailedByIdAsync(int userId)
    {
        return await context.Users
            .Include(x => x.UserRoles)
            .ThenInclude(x => x.Role)
            .SingleOrDefaultAsync(x => x.Id == userId);
    }

    public async Task<PagedList<MemberDto>> GetMembersAsync(MemberParams memberParams)
    {
        var query = context.Users.AsQueryable();

        if (memberParams.MemberId != null)
        {
            query = query.Where(x => x.Id == memberParams.MemberId);
        }

        if (memberParams.DepartmentId != null)
        {
            query = query.Where(x => x.DepartmentId == memberParams.DepartmentId);
        }

        if (memberParams.FirstName != null)
        {
            query = query.Where(x => x.FirstName == memberParams.FirstName);
        }

        if (memberParams.LastName != null)
        {
            query = query.Where(x => x.LastName == memberParams.LastName);
        }

        query = memberParams.Status switch
        {
            "manager" => query.Where(x => x.UserRoles.Select(y => y.Role.Name).ToList().Contains("Manager")),
            "user" => query.Where(x => x.UserRoles.Select(y => y.Role.Name).ToList().Contains("User")),
            //"all"
            _ => query.Where(x => !x.UserRoles.Select(y => y.Role.Name).ToList().Contains("Admin"))
        };

        query = memberParams.OrderBy switch
        {
            "lastName" => query.OrderBy(x => x.LastName),
            "lastName-desc" => query.OrderByDescending(x => x.LastName),
            "firstName" => query.OrderBy(x => x.FirstName),
            "firstName-desc" => query.OrderByDescending(x => x.FirstName),
            "recentActive" => query.OrderBy(x => x.LastActive),
            "recentActive-desc" => query.OrderByDescending(x => x.LastActive),
            _ => query.OrderBy(x => x.LastName),
        };

        return await PagedList<MemberDto>.CreateAsync(
            query.ProjectTo<MemberDto>(mapper.ConfigurationProvider), 
            memberParams.PageNumber, memberParams.PageSize);
    }
}
