import { useQuery } from "@tanstack/react-query"
import { ExtraServiceClient } from "../api"

export const useFetchExtraServicesQuery = () => {
    return useQuery({
        queryKey: ['extraServices'],
        queryFn: async () => {
            return await new ExtraServiceClient().getExtraServices();
        }
    })
}