namespace RentACar.Application.Common.Models
{
    public class OptionsDto
    {
        public int Id { get; init; }

        public string? Name { get; init; }

        private class Mapping : IRegister
        {
            public void Register(TypeAdapterConfig config)
            {

            }
        }
    }
}
