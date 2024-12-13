using API.DTOs;
using API.Entities;
using API.Extensions;
using API.Helpers;
using API.Interfaces;
using AutoMapper;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;

namespace API.Controllers;

[Authorize]
public class UsersController(IUserRepository userRepository, IMapper mapper, 
    UserManager<AppUser> userManager, ITokenService tokenService) : BaseApiController
{
    [HttpGet]
    public async Task<ActionResult<PagedList<MemberDto>>> GetUsers([FromQuery] MemberParams memberParams)
    {
        var members = await userRepository.GetMembersAsync(memberParams);
        Response.AddPaginationHeader(members);
        
        return Ok(members);
    }

    [HttpGet("{userId}")]
    public async Task<ActionResult<MemberDto>> GetUser(int userId)
    {
        var user = await userRepository.GetUserDetailedByIdAsync(userId);
        if (user == null) return NotFound();

        var result = mapper.Map<MemberDto>(user);
        if (result.Role == "Admin")
        {
            var currentUser = await userRepository.GetUserByIdAsync(User.GetUserId());
            if (currentUser == null) return NotFound();

            var roles = await userManager.GetRolesAsync(currentUser);
            if (!roles.Contains("Admin")) return Unauthorized();
        }

        return Ok(result);
    }

    [Authorize(Policy = "RequireAdminRole")]
    [HttpPost]
    public async Task<ActionResult> CreateUser(RegisterDto registerDto)
    {
        if (await userManager.Users.AnyAsync(x => x.NormalizedUserName == registerDto.Username.ToUpper()))
            return BadRequest("Username is taken");

        var user = mapper.Map<AppUser>(registerDto);
        user.UserName = registerDto.Username.ToLower();

        var result = await userManager.CreateAsync(user, registerDto.Password);
        if (!result.Succeeded) return BadRequest(result.Errors);
        await userManager.AddToRoleAsync(user, "User");

        var userToReturn = mapper.Map<UserDto>(user);
        userToReturn.Token = await tokenService.CreateToken(user);

        return NoContent();
    }

    [Authorize(Policy = "RequireAdminRole")]
    [HttpPut("{userId}")]
    public async Task<ActionResult> EditUserPassword(int userId, AdminEditPasswordDto adminEditPasswordDto)
    {
        var user = await userRepository.GetUserByIdAsync(userId);
        if (user == null) return NotFound();

        var resetToken = await userManager.GeneratePasswordResetTokenAsync(user);
        var passwordChangeResult = await userManager.ResetPasswordAsync(user, resetToken, adminEditPasswordDto.NewPassword);

        if (!passwordChangeResult.Succeeded) return BadRequest(passwordChangeResult.Errors);
        return NoContent();
    }

    [Authorize(Policy = "RequireAdminRole")]
    [HttpDelete("{userId}")]
    public async Task<ActionResult> DeleteUser(int userId)
    {
        var user = await userRepository.GetUserByIdAsync(userId);
        if (user == null) return NotFound();

        var roles = await userManager.GetRolesAsync(user);
        if (roles.Contains("Admin")) return BadRequest("You cannot delete admin user");
        
        var deleteResult = await userManager.DeleteAsync(user);

        if (!deleteResult.Succeeded) return BadRequest(deleteResult.Errors);
        return NoContent();
    }
}