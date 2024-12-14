using System.Security.Claims;
using API.Entities;

namespace API.Interfaces;

public interface ITokenService
{
    Task<string> CreateToken(AppUser user);
    Task<RefreshToken> CreateRefreshToken(string username);
    ClaimsPrincipal? GetPrincipalFromExpiredToken(string token);
    void AddRefreshToken(RefreshToken refreshToken);
    void RemoveRefreshToken(RefreshToken refreshToken);
    Task<RefreshToken?> GetRefreshToken(string username, string token);
    Task<bool> Complete();
}
