import { useQuery } from "@tanstack/react-query";
import { formatOptions } from "../../helpers/OptionsMappingHelper";
import { LocationClient } from "../api";

export const useFetchLocationOptions = () => {
    return useQuery({
        queryKey: ["locationOptions"],
        queryFn: async () => {
            return formatOptions(await new LocationClient().getLocationOptions());
        },
    });
};

export const useFetchLocations = () => {
    return useQuery({
        queryKey: ["locations"],
        queryFn: async () => {
            return await new LocationClient().getLocations();
        },
    })
}

export const useFetchLocationByIdQuery = (id?: number) => {
    return useQuery({
        queryKey: ["location", id],
        queryFn: async () => {
            return await new LocationClient().getLocationById(id!);
        },
        enabled: !!id,
    })
}