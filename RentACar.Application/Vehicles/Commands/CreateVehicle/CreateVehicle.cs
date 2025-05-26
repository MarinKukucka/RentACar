using Mediator;
using RentACar.Application.Common.Interfaces;
using RentACar.Domain.Entities;
using RentACar.Domain.Enums;
using System.ComponentModel.DataAnnotations;

namespace RentACar.Application.Vehicles.Commands.CreateVehicle
{
    public record CreateVehicleCommand : IRequest
    {
        public required string VIN { get; set; }

        public required string LicensePlate { get; set; }

        public int Year { get; set; }

        public int Mileage { get; set; }

        public VehicleType VehicleType { get; set; }

        public Transmission Transmission { get; set; }

        public FuelType FuelType { get; set; }

        public int Power { get; set; }

        public int Seats { get; set; }

        public decimal Price { get; set; }

        public int ModelId { get; set; }

        public int LocationId { get; set; }
    }

    public class CreateVehicleCommandHandler(IApplicationDbContext _context) : IRequestHandler<CreateVehicleCommand>
    {
        public async ValueTask<Unit> Handle(CreateVehicleCommand request, CancellationToken cancellationToken)
        {
            var vehicle = request.Adapt<Vehicle>();
            vehicle.IsAvailable = true;

            _context.Vehicles.Add(vehicle);

            await _context.SaveChangesAsync(cancellationToken);

            return Unit.Value;
        }
    }
}
