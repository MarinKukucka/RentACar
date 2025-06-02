import { useMutation } from "@tanstack/react-query";
import {
    CreateReservationCommand,
    ReservationClient,
    UpdateReservationCommand,
} from "../api";

export const useCreateReservationMutation = () => {
    return useMutation({
        mutationFn: async (command: CreateReservationCommand) => {
            return await new ReservationClient().createReservation(command);
        },
    });
};

export const useUpdateReservationMutation = () => {
    return useMutation({
        mutationFn: async (command: UpdateReservationCommand) => {
            return await new ReservationClient().updateReservation(command);
        },
    });
};
