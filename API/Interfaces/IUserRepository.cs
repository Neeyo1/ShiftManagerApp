using API.DTOs;
using API.Entities;
using API.Helpers;

namespace API.Interfaces;

public interface IUserRepository
{
    Task<IEnumerable<AppUser>> GetUsersAsync();
    Task<AppUser?> GetUserByIdAsync(int userId);
    Task<AppUser?> GetUserByUsernameAsync(string username);
    Task<AppUser?> GetUserDetailedByIdAsync(int userId);
    Task<PagedList<MemberDto>> GetMembersAsync(MemberParams memberParams);
}
