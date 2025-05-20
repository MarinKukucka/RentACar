import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query"
import { CreateUserAndPersonCommand, PersonClient } from "../api"
import { PeopleFilters } from "../../routes/_authorizedRoutes/people";

export const useFetchPaginatedPeopleQuery = (request: PeopleFilters) => {
    return useQuery({
        queryKey: ['people'],
        queryFn: async () => {
            return await new PersonClient().getPaginatedPeople(
                request.firstName, 
                request.lastName, 
                request.phoneNumber, 
                request.currentPage, 
                request.pageSize,
                request.sortBy,
                request.sortOrder
            );
        }
    })
}

export const useCreateUserAndPersonMutation = () => {
    const queryClient = useQueryClient();
    
    return useMutation({
        mutationFn: async (command: CreateUserAndPersonCommand) => {
            return await new PersonClient().createUserAndPerson(command);
        },
        onSuccess: () => {
            queryClient.invalidateQueries({queryKey: ['people']});
        }
    })
}

export const useDisablePersonMutation = () => {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: async (id: number) => {
            return await new PersonClient().disablePerson(id);
        },
        onSuccess: () => {
            queryClient.invalidateQueries({queryKey: ['people']});
        }
    })
}