import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
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
        queryKey: ["reservations", JSON.stringify(request)],
        queryFn: async () => {
            return await new ReservationClient().getPaginatedReservations(
                request.id,
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

export const useFetchTodaysReservationsQuery = () => {
    return useQuery({
        queryKey: ["todaysReservations"],
        queryFn: async () => {
            return await new ReservationClient().getTodaysReservations();
        }
    })
}

export const useFetchReservationByIdQuery = (id: number) => {
    return useQuery({
        queryKey: ['reservationById', id],
        queryFn: async () => {
            return await new ReservationClient().getReservationById(id);
        }
    })
}

export const useCreateReservationMutation = () => {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: async (command: CreateReservationCommand) => {
            return await new ReservationClient().createReservation(command);
        },
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["reservations"] });
            queryClient.invalidateQueries({ queryKey: ["todaysReservations"] });
        },
    });
};

export const useUpdateReservationMutation = () => {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: async (command: UpdateReservationCommand) => {
            return await new ReservationClient().updateReservation(command);
        },
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["reservations"] });
            queryClient.invalidateQueries({ queryKey: ["todaysReservations"] });
        },
    });
};
