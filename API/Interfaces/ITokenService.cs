using System.Security.Claims;
using API.Entities;

namespace API.Interfaces;

public interface ITokenService
{
    Task<string> CreateToken(AppUser user);
    Task<RefreshToken> CreateRefreshToken(string username);
    ClaimsPrincipal? GetPrincipalFromExpiredToken(string token);
}
