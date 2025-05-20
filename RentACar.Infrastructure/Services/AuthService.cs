using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Identity;
using RentACar.Domain.Entities;

namespace RentACar.Infrastructure.Services
{
    public interface IAuthService
    {
        Task<SignInResult> PasswordSignInAsync(string email, string password, bool rememberMe);
        Task SignOutAsync();
        Task<ApplicationUser?> GetCurrentUserAsync(HttpContext httpContext);
        Task<IList<string>> GetUserRolesAsync(ApplicationUser user);
    }

    public class IdentityAuthService(
        SignInManager<ApplicationUser> signInManager,
        UserManager<ApplicationUser> userManager) : IAuthService
    {
        public async Task<SignInResult> PasswordSignInAsync(
            string email, string password, bool rememberMe)
        {
            // Uses Identity’s cookie authentication under the hood
            return await signInManager.PasswordSignInAsync(
                userName: email,
                password: password,
                isPersistent: rememberMe,
                lockoutOnFailure: false);
        }

        public async Task SignOutAsync()
        {
            await signInManager.SignOutAsync();
        }

        public async Task<ApplicationUser?> GetCurrentUserAsync(HttpContext httpContext)
        {
            return await userManager.GetUserAsync(httpContext.User);
        }

        public async Task<IList<string>> GetUserRolesAsync(ApplicationUser user)
        {
            return await userManager.GetRolesAsync(user);
        }
    }
}