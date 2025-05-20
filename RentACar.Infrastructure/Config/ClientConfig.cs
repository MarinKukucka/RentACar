namespace RentACar.Infrastructure.Config
{
    public class ClientConfig
    {
        public string ClientId { get; set; } = null!;
        public string? ClientSecret { get; set; }
        public string DisplayName { get; set; } = null!;
        public string LoginUrl { get; set; } = null!;
        public string RedirectUri { get; set; } = null!;
        public string ResetPasswordUri { get; set; } = null!;
        public string SetPasswordUri { get; set; } = null!;
        public string PostLogoutRedirectUri { get; set; } = null!;
    }
}
