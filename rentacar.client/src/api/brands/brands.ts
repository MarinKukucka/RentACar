import { useQuery } from "@tanstack/react-query";
import { formatOptions } from "../../helpers/OptionsMappingHelper";
import { BrandClient } from "../api";

export const useFetchBrandOptions = () => {
    return useQuery({
        queryKey: ["brandOptions"],
        queryFn: async () => {
            return formatOptions(await new BrandClient().getBrandOptions());
        },
    });
};
