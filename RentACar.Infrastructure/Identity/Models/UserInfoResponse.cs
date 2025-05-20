using Mapster;
using RentACar.Application.People.Dtos;

namespace RentACar.Infrastructure.Identity.Models
{
    public class UserInfoResponse
    {
        public string? FirstName { get; set; }
        public string? LastName { get; set; }
        public string? PhoneNumber { get; set; }
        public string? Email { get; set; }
        public bool IsEmailConfirmed { get; set; }
        private class Mapping : IRegister
        {
            public void Register(TypeAdapterConfig config)
            {
                config.NewConfig<UserInfoResponse, Application.People.Dtos.PersonDto>()
                    .Ignore(dest => dest.Email!);

                config.NewConfig<Application.People.Dtos.PersonDto, UserInfoResponse>()
                    .Ignore(dest => dest.Email!);
            }
        }
    }
}
