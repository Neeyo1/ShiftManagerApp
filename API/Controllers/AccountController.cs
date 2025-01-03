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
    IMapper mapper, IUnitOfWork unitOfWork, IMailService mailService) : BaseApiController
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

    [HttpPost("forgot-password")]
    public async Task<ActionResult<UserDto>> ForgotPassword(ForgotPasswordDto forgotPasswordDto)
    {
        var user = await userManager.FindByEmailAsync(forgotPasswordDto.Mail);
        if (user == null || user.UserName == null || user.Email == null)
            return BadRequest("User with this email does not exist");

        if (user.EmailConfirmed == false)
            return BadRequest("This user's email was not confirmed");

        var token = await userManager.GeneratePasswordResetTokenAsync(user);
        if (token == null) return BadRequest("Failed to generate reset password token");

        await mailService.SendMailAsync(user.Email, "Reset password",
            $"Your password reset link: https://shiftmanager.pl/reset-password?email={user.Email}&token={token}");
        return Ok("Email sent successfully!");
    }

    [HttpPut("reset-password")]
    public async Task<ActionResult<UserDto>> ResetPassword(ResetPasswordDto resetPasswordDto)
    {
        if (resetPasswordDto.Email == null)
            return BadRequest("No email provided");
        if (resetPasswordDto.Token == null)
            return BadRequest("No token provided");

        var user = await userManager.FindByEmailAsync(resetPasswordDto.Email);
        if (user == null || user.UserName == null || user.Email == null)
            return BadRequest("User with this email does not exist");

        var result = await userManager.ResetPasswordAsync(user, resetPasswordDto.Token, resetPasswordDto.NewPassword);
        if (result.Succeeded) return Ok("Password changed successfully");
        return BadRequest(result.Errors);
    }

    [HttpPost("confirm-account")]
    public async Task<ActionResult<UserDto>> ConfirmAccount(MailConfirm mailConfirm)
    {
        var user = await userManager.FindByEmailAsync(mailConfirm.Email);
        if (user == null || user.UserName == null || user.Email == null)
            return BadRequest("User with this email does not exist");

        var result = await userManager.ConfirmEmailAsync(user, mailConfirm.Token);
        if (result.Succeeded) return Ok("Email confirmed successfully");
        return BadRequest(result.Errors);
    }

    [Authorize]
    [HttpPost("test-mail")]
    public async Task<ActionResult> TestMail(SendMailDto sendMailDto)
    {
        await mailService.SendMailAsync(sendMailDto.ToMail, sendMailDto.Subject, sendMailDto.Body);
        return Ok("Email sent successfully!");
    }
}
