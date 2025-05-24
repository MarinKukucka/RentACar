import { useQuery } from "@tanstack/react-query";
import { ModelClient } from "../api";
import { formatOptions } from "../../helpers/OptionsMappingHelper";

export const useFetchModelOptionsByBrandId = (brandId: number) => {
    return useQuery({
        queryKey: ["modelOptions"],
        queryFn: async () => {
            return formatOptions(await new ModelClient().getModelOptionsByBrandId(brandId));
        },
    });
};
