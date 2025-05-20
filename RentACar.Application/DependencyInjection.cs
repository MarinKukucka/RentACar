using Microsoft.Extensions.DependencyInjection;

namespace RentACar.Application
{
    public static class DependencyInjection
    {
        public static IServiceCollection AddApplicationServices(this IServiceCollection services)
        {
            services.AddMediator(options =>
            {
                options.ServiceLifetime = ServiceLifetime.Transient;
            });

            services.AddMapster();

            return services;
        }
    }
}
