using System.ComponentModel.DataAnnotations;
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
public class UsersController(IUnitOfWork unitOfWork, IMapper mapper, UserManager<AppUser> userManager,
    IEmailService emailService) : BaseApiController
{
    [HttpGet]
    public async Task<ActionResult<PagedList<MemberDto>>> GetUsers([FromQuery] MemberParams memberParams)
    {
        var members = await unitOfWork.UserRepository.GetMembersAsync(memberParams);
        Response.AddPaginationHeader(members);
        
        return Ok(members);
    }

    [HttpGet("{userId}")]
    public async Task<ActionResult<MemberDto>> GetUser(int userId)
    {
        var user = await unitOfWork.UserRepository.GetUserDetailedByIdAsync(userId);
        if (user == null) return NotFound();

        var result = mapper.Map<MemberDto>(user);
        if (result.Role == "Admin")
        {
            var currentUser = await unitOfWork.UserRepository.GetUserByIdAsync(User.GetUserId());
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
        
        var emailValidation = new EmailAddressAttribute();
        if (!emailValidation.IsValid(registerDto.Email))
            return BadRequest($"Email {registerDto.Email} is not valid");

        var userWithEmail = await userManager.FindByEmailAsync(registerDto.Email);
        if (userWithEmail != null)
            return BadRequest("User with this email already exists");

        var user = mapper.Map<AppUser>(registerDto);
        user.UserName = registerDto.Username.ToLower();

        var result = await userManager.CreateAsync(user, registerDto.Password);
        if (!result.Succeeded) return BadRequest(result.Errors);
        await userManager.AddToRoleAsync(user, "User");

        var token = await userManager.GenerateEmailConfirmationTokenAsync(user);
        if (token == null) return BadRequest("Failed to generate reset password token");

        await emailService.SendEmailAsync(user, "Account confirmation",
            $"New account has been created using your email, to confirm your identity please click this link: https://shiftmanager.pl/account/account-confirm?email={user.Email}&token={token}");

        if (unitOfWork.HasChanges())
        {
            await unitOfWork.Complete();
            return NoContent();
        }
            
        return BadRequest("Failed to send email");
    }

    [Authorize(Policy = "RequireAdminRole")]
    [HttpPut("{userId}")]
    public async Task<ActionResult> EditUserPassword(int userId, ResetPasswordDto resetPasswordDto)
    {
        var currentUser = await unitOfWork.UserRepository.GetUserByIdAsync(User.GetUserId());
        if (currentUser == null || currentUser.UserName == null)
            return BadRequest("Could not find current user");
        if (currentUser.UserName == "demoadmin") return BadRequest("You cannot do that as demo admin");

        var user = await unitOfWork.UserRepository.GetUserByIdAsync(userId);
        if (user == null) return BadRequest("Failed to find user");

        var resetToken = await userManager.GeneratePasswordResetTokenAsync(user);
        var passwordChangeResult = await userManager.ResetPasswordAsync(user, resetToken, resetPasswordDto.NewPassword);

        if (!passwordChangeResult.Succeeded) return BadRequest(passwordChangeResult.Errors);
        return NoContent();
    }

    [Authorize(Policy = "RequireAdminRole")]
    [HttpDelete("{userId}")]
    public async Task<ActionResult> DeleteUser(int userId)
    {
        var user = await unitOfWork.UserRepository.GetUserByIdAsync(userId);
        if (user == null) return BadRequest("Failed to find user");

        var roles = await userManager.GetRolesAsync(user);
        if (roles.Contains("Admin")) return BadRequest("You cannot delete admin user");
        
        var deleteResult = await userManager.DeleteAsync(user);

        if (!deleteResult.Succeeded) return BadRequest(deleteResult.Errors);
        return NoContent();
    }
}