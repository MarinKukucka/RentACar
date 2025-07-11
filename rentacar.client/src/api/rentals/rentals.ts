import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { CreateRentalCommand, RentalClient } from "../api";
import { RentalsFilters } from "../../components/rentals/Rentals";
import { FinishRentalCommand } from "../../models/rentalCommands";

export const useFetchPaginatedRentalsQuery = (request: RentalsFilters) => {
    return useQuery({
        queryKey: ["rentals"],
        queryFn: async () => {
            return await new RentalClient().getPaginatedVehicles(
                request.id,
                request.status,
                request.currentPage,
                request.pageSize,
                request.sortBy,
                request.sortOrder
            );
        },
    });
};

export const useFetchTodaysRentalsQuery = () => {
    return useQuery({
        queryKey: ["todaysRentals"],
        queryFn: async () => {
            return await new RentalClient().getTodaysRentals();
        }
    })
}

export const useFetchRentalByIdQuery = (id: number) => {
    return useQuery({
        queryKey: ["rentalById", id],
        queryFn: async () => {
            return await new RentalClient().getRentalById(id);
        }
    })
}

export const useCreateRentalMutation = () => {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: async (command: CreateRentalCommand) => {
            return await new RentalClient().createRental(command);
        },
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["rentals"] });
            queryClient.invalidateQueries({ queryKey: ["todaysRentals"] });
        },
    });
};

export const useFinishRentalMutation = () => {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: async (command: FinishRentalCommand) => {
            return await new RentalClient().finishRental(
                command.id,
                command.returnDateTime,
                command.odometerEnd,
                command.notes,
                command.files
            );
        },
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["rentals"] });
            queryClient.invalidateQueries({ queryKey: ["todaysRentals"] });
        },
    });
};
