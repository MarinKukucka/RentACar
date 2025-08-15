import { useMutation, useQuery } from "@tanstack/react-query"
import { IdentityClient, SetPasswordDto, UpdateUserInfoRequest } from "../api"

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

export const useSetPasswordMutation = () => {
    return useMutation({
        mutationFn: async (command: SetPasswordDto) => {
            return await new IdentityClient().setPassword(command);
        }
    })
}