import { useMutation } from "@tanstack/react-query";
import { PaymentClient, PaymentRequest } from "../api";

export const useCreatePaymentIntentMutation = () => {
    return useMutation({
        mutationFn: async (request: PaymentRequest) => {
            return await new PaymentClient().createPaymentIntent(request);
        },
    });
};
