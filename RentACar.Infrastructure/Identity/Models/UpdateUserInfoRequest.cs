namespace RentACar.Infrastructure.Identity.Models
{
    public class UpdateUserInfoRequest : UserInfoResponse
    {
        public string? NewPassword { get; init; }
        public string? OldPassword { get; init; }
        public required string ClientId { get; init; }
    }
}
