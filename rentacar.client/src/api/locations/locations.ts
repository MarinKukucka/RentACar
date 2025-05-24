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