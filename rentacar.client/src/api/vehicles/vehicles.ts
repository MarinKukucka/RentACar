import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query"
import { VehicleClient } from "../api"
import { VehiclesFilter } from "../../components/vehicles/Vehicles";

export const useFetchPaginatedVehiclesQuery = (request: VehiclesFilter) => {
    return useQuery({
        queryKey: ['vehicles'],
        queryFn: async () => {
            return await new VehicleClient().getPaginatedVehicles(
                request.vin,
                request.licensePlate,
                request.year,
                request.mileage,
                request.vehicleType,
                request.transmission,
                request.fuelType,
                request.currentPage,
                request.pageSize,
                request.sortBy,
                request.sortOrder
            );
        }
    })
}

export const useDeleteVehicleMutation = () => {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: async (id: number) => {
            return await new VehicleClient().deleteVehicle(id);
        },
        onSuccess: () => {
            queryClient.invalidateQueries({queryKey: ['vehicles']});
        }
    })
}