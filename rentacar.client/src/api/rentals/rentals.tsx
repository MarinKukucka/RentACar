import { useMutation } from "@tanstack/react-query";
import { CreateRentalCommand, RentalClient } from "../api";

export const useCreateRentalMutation = () => {
    return useMutation({
        mutationFn: async (command: CreateRentalCommand) => {
            return await new RentalClient().createRental(command);
        },
    });
};
