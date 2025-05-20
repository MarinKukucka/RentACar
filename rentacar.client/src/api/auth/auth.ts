import { useMutation, useQuery } from "@tanstack/react-query"
import { AuthClient, LoginDto } from "../api"

export const useFetchMeQuery = () => {
    return useQuery({
        queryKey: ['me'],
        queryFn: async () => {
            return await new AuthClient().me();
        }
    })
}

export const useLoginMutation = () => {
    return useMutation({
        mutationFn: async (login: LoginDto) => {
            await new AuthClient().login(login);
        }
    })
}

export const useLogoutMutation = () => {
    return useMutation({
        mutationFn: async () => {
            await new AuthClient().logout();
        }
    })
}