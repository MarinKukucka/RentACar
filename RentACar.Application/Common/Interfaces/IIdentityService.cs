using RentACar.Application.People.Dtos;

namespace RentACar.Application.Common.Interfaces
{
    public interface IIdentityService
    {
        Task<string?> GetUserNameAsync(string userId);

        Task<bool> IsInRoleAsync(string userId, string role);

        Task<bool> AuthorizeAsync(string userId, string policyName);

        Task DisableUserAsync(string userId);
        Task EnableUserAsync(string id);
    }

}
