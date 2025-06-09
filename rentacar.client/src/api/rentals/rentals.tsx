import { useMutation, useQuery } from "@tanstack/react-query";
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

export const useCreateRentalMutation = () => {
    return useMutation({
        mutationFn: async (command: CreateRentalCommand) => {
            return await new RentalClient().createRental(command);
        },
    });
};

export const useFinishRentalMutation = () => {
    return useMutation({
        mutationFn: async (command: FinishRentalCommand) => {
            return await new RentalClient().finishRental(
                command.returnDateTime,
                command.odometerEnd,
                command.notes,
                command.files
            );
        },
    });
};
