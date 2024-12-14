using API.DTOs;
using API.Entities;
using API.Extensions;
using API.Interfaces;
using AutoMapper;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;

namespace API.Controllers;

public class AccountController(UserManager<AppUser> userManager, ITokenService tokenService,
    IMapper mapper) : BaseApiController
{
    [HttpPost("login")]
    public async Task<ActionResult<UserDto>> Login(LoginDto loginDto)
    {
        var user = await userManager.Users
            .SingleOrDefaultAsync(x => x.NormalizedUserName == loginDto.Username.ToUpper());
        if (user == null || user.UserName == null) return BadRequest("Invalid username or password");
        if (!await userManager.CheckPasswordAsync(user, loginDto.Password))
            return BadRequest("Invalid username or password");

        var userToReturn = mapper.Map<UserDto>(user);
        userToReturn.Token = await tokenService.CreateToken(user);

        var refreshToken = await tokenService.CreateRefreshToken(user.UserName);
        userToReturn.RefreshToken = refreshToken.Token;

        return userToReturn;
    }

    [Authorize]
    [HttpPost("change-password")]
    public async Task<ActionResult<UserDto>> ChangePassword(UserEditPasswordDto userEditPasswordDto)
    {
        var user = await userManager.FindByNameAsync(User.GetUsername());
        if (user == null || user.UserName == null) return BadRequest("Could not find user");

        var result = await userManager.ChangePasswordAsync(user, userEditPasswordDto.CurrentPassword, 
            userEditPasswordDto.NewPassword);
        if (!result.Succeeded) return BadRequest(result.Errors);
        
        var userToReturn = mapper.Map<UserDto>(user);
        userToReturn.Token = await tokenService.CreateToken(user);

        var refreshToken = await tokenService.CreateRefreshToken(user.UserName);
        userToReturn.RefreshToken = refreshToken.Token;

        return userToReturn;
    }

    [HttpPost("refresh")]
    public async Task<ActionResult<UserDto>> Refresh(RefreshTokenDto refreshTokenDto)
    {
        var principal = tokenService.GetPrincipalFromExpiredToken(refreshTokenDto.Token);
        if (principal == null) 
        {
            return BadRequest("Invalid token");
        }

        var username = principal.GetUsername();
        var storedRefreshToken = await tokenService.GetRefreshToken(username, refreshTokenDto.RefreshToken);

        if (storedRefreshToken == null) return Unauthorized("Invalid refresh token");

        if (storedRefreshToken.ExpiryDate < DateTime.UtcNow) 
        {
            return Unauthorized("Invalid refresh token");
        }

        var user = await userManager.FindByNameAsync(username);
        if (user == null || user.UserName == null) return BadRequest("Could not find user");

        tokenService.RemoveRefreshToken(storedRefreshToken);
        if (await tokenService.Complete())
        {
            var userToReturn = mapper.Map<UserDto>(user);
            userToReturn.Token = await tokenService.CreateToken(user);
            
            var newRefreshToken = await tokenService.CreateRefreshToken(username);
            userToReturn.RefreshToken = newRefreshToken.Token;

            return userToReturn;
        }
        return BadRequest("Failed to refresh token");
    }
}
