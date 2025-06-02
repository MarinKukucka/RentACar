import { useMutation, useQuery } from "@tanstack/react-query";
import {
    CreateReservationCommand,
    ReservationClient,
    UpdateReservationCommand,
} from "../api";
import { ReservationsFilter } from "../../components/reservations/Reservations";

export const useFetchPaginatedReservationsQuery = (
    request: ReservationsFilter
) => {
    return useQuery({
        queryKey: ["reservations", request],
        queryFn: async () => {
            return await new ReservationClient().getPaginatedReservations(
                request.startDateTime,
                request.endDateTime,
                request.status,
                request.currentPage,
                request.pageSize,
                request.sortBy,
                request.sortOrder
            );
        },
    });
};

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
