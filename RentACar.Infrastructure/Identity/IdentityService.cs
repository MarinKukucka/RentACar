using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Identity;
using RentACar.Application.Common.Interfaces;
using RentACar.Domain.Entities;

namespace RentACar.Infrastructure.Identity
{
    public class IdentityService(UserManager<ApplicationUser> userManager,
    IUserClaimsPrincipalFactory<ApplicationUser> userClaimsPrincipalFactory,
    IAuthorizationService authorizationService) : IIdentityService
    {
        public async Task<string?> GetUserNameAsync(string userId)
        {
            var user = await userManager.FindByIdAsync(userId);

            return user?.UserName;
        }

        public async Task<bool> IsInRoleAsync(string userId, string role)
        {
            var user = await userManager.FindByIdAsync(userId);

            return user != null && await userManager.IsInRoleAsync(user, role);
        }

        public async Task<bool> AuthorizeAsync(string userId, string policyName)
        {
            var user = await userManager.FindByIdAsync(userId);

            if (user == null)
            {
                return false;
            }

            var principal = await userClaimsPrincipalFactory.CreateAsync(user);

            var result = await authorizationService.AuthorizeAsync(principal, policyName);

            return result.Succeeded;
        }

        public async Task DisableUserAsync(string userId)
        {
            var user = await userManager.FindByIdAsync(userId);

            if (user != null)
            {
                var lockoutEndDate = DateTimeOffset.UtcNow.AddYears(100);

                await userManager.SetLockoutEndDateAsync(user, lockoutEndDate);
            }
        }

        public async Task EnableUserAsync(string userId)
        {
            var user = await userManager.FindByIdAsync(userId);
            if (user != null)
            {
                await userManager.SetLockoutEndDateAsync(user, null);
            }
        }
    }
}
