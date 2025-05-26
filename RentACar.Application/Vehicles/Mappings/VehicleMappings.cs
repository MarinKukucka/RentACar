using RentACar.Application.Vehicles.Dtos;
using RentACar.Domain.Entities;

namespace RentACar.Application.Vehicles.Mappings
{
    public class VehicleMappings : IRegister
    {
        public void Register(TypeAdapterConfig config)
        {
            config.NewConfig<Vehicle, SimpleVehicleDto>()
                .Map(dest => dest.Name, src => src.Model != null ? src.Model.Name.ToString() : "")
                .Map(dest => dest.Image, src => src.Model != null && src.Model.File != null ? src.Model.File.Path : null);
        }
    }
}
