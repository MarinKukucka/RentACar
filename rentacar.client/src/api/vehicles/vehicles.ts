import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query"
import { CreateVehicleCommand, VehicleClient } from "../api"
import { VehiclesFilter } from "../../components/vehicles/Vehicles";

export const useFetchPaginatedVehiclesQuery = (request: VehiclesFilter) => {
    return useQuery({
        queryKey: ['vehicles', JSON.stringify(request)],
        queryFn: async () => {
            return await new VehicleClient().getPaginatedVehicles(
                request.vin,
                request.licensePlate,
                request.year,
                request.mileage,
                request.vehicleType,
                request.transmission,
                request.fuelType,
                request.price,
                request.currentPage,
                request.pageSize,
                request.sortBy,
                request.sortOrder
            );
        }
    })
}

export const useFetchSimpleVehiclesQuery = () => {
    return useQuery({
        queryKey: ['simpleVehicles'],
        queryFn: async () => {
            return await new VehicleClient().getSimpleVehicles();
        }
    })
}

export const useFetchSearchResultVehiclesQuery = (pickupLocationId?: number, pickupDate?: Date, dropOffDate?: Date) => {
    return useQuery({
        queryKey: ['searchResultvehicles', pickupLocationId, pickupDate, dropOffDate],
        queryFn: async () => {
            return await new VehicleClient().getSearchResultVehicles(pickupLocationId, pickupDate, dropOffDate);
        }
    })
}

export const useFetchVehicleByIdQuery = (id?: number) => {
    return useQuery({
        queryKey: ['vehicle', id],
        queryFn: async () => {
            return await new VehicleClient().getVehicleById(id!);
        },
        enabled: !!id
    })
}

export const useCreateVehicleMutation = () => {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: async (command: CreateVehicleCommand) => {
            return await new VehicleClient().createVehicle(command);
        },
        onSuccess: () => {
            queryClient.invalidateQueries({queryKey: ['vehicles']});
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