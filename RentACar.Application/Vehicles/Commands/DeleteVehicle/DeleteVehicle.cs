using Mediator;
using Microsoft.EntityFrameworkCore;
using RentACar.Application.Common.Interfaces;

namespace RentACar.Application.Vehicles.Commands.DeleteVehicle
{
    public record DeleteVehicleCommand(int Id) : IRequest;

    public class DeleteVehicleCommandHandler(IApplicationDbContext _context) : IRequestHandler<DeleteVehicleCommand>
    {
        public async ValueTask<Unit> Handle(DeleteVehicleCommand request, CancellationToken cancellationToken)
        {
            await _context.Vehicles
                .Where(v => v.Id == request.Id)
                .ExecuteDeleteAsync(cancellationToken);

            return Unit.Value;
        }
    }
}
