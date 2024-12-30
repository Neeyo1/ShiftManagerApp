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
    IMapper mapper, IUnitOfWork unitOfWork) : BaseApiController
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
        HttpContext.SetRefreshToken(refreshToken.Token);

        return userToReturn;
    }

    [Authorize]
    [HttpPost("change-password")]
    public async Task<ActionResult<UserDto>> ChangePassword(UserEditPasswordDto userEditPasswordDto)
    {
        var user = await userManager.FindByNameAsync(User.GetUsername());
        if (user == null || user.UserName == null) return BadRequest("Could not find user");
        if (user.UserName == "demoadmin") return BadRequest("You cannot do that as demo admin");

        var result = await userManager.ChangePasswordAsync(user, userEditPasswordDto.CurrentPassword, 
            userEditPasswordDto.NewPassword);
        if (!result.Succeeded) return BadRequest(result.Errors);
        
        var userToReturn = mapper.Map<UserDto>(user);
        userToReturn.Token = await tokenService.CreateToken(user);

        var refreshToken = await tokenService.CreateRefreshToken(user.UserName);
        HttpContext.SetRefreshToken(refreshToken.Token);

        return userToReturn;
    }

    [HttpPost("refresh")]
    public async Task<ActionResult<UserDto>> Refresh(TokenDto tokenDto)
    {
        var principal = tokenService.GetPrincipalFromExpiredToken(tokenDto.Token);
        if (principal == null) 
        {
            return BadRequest("Invalid token");
        }

        var username = principal.GetUsername();

        var refreshToken = HttpContext.GetRefreshToken();
        if (refreshToken == null) return BadRequest("No refresh token was provided");

        var storedRefreshToken = await unitOfWork.TokenRepository.GetRefreshToken(username, refreshToken);
        if (storedRefreshToken == null) return BadRequest("Invalid refresh token");

        if (storedRefreshToken.ExpiryDate < DateTime.UtcNow) 
        {
            return BadRequest("Invalid refresh token");
        }

        var user = await userManager.FindByNameAsync(username);
        if (user == null || user.UserName == null) return BadRequest("Could not find user");

        unitOfWork.TokenRepository.RemoveRefreshToken(storedRefreshToken);
        if (await unitOfWork.Complete())
        {
            var userToReturn = mapper.Map<UserDto>(user);
            userToReturn.Token = await tokenService.CreateToken(user);
            
            var newRefreshToken = await tokenService.CreateRefreshToken(username);
            HttpContext.SetRefreshToken(newRefreshToken.Token);

            return userToReturn;
        }
        return BadRequest("Failed to refresh token");
    }
}
