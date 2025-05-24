import { useQuery } from "@tanstack/react-query";
import { ModelClient } from "../api";
import { formatOptions } from "../../helpers/OptionsMappingHelper";

export const useFetchModelOptionsByBrandId = (brandId: number | undefined) => {
    return useQuery({
        queryKey: ["modelOptions", brandId],
        queryFn: async () => {
            return formatOptions(await new ModelClient().getModelOptionsByBrandId(brandId!));
        },
        enabled: !!brandId
    });
};
