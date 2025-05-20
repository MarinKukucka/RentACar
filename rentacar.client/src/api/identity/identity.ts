import { useMutation, useQuery } from "@tanstack/react-query"
import { IdentityClient, UpdateUserInfoRequest } from "../api"

export const useFetchUserInfoQuery = () => {
    return useQuery({
        queryKey: ['person'],
        queryFn: async () => {
            return await new IdentityClient().getUserInfo();
        }
    })
}

export const useUpdateUserInfoMutation = () => {
    return useMutation({
        mutationFn: async (command: UpdateUserInfoRequest) => {
            return await new IdentityClient().manageUserInfo(command);
        }
    })
}