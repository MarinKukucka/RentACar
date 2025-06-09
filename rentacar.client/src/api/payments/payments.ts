import { useMutation } from "@tanstack/react-query";
import {
    CreatePaymentCommand,
    PaymentClient,
    PaymentIntentRequest,
} from "../api";

export const useCreatePaymentIntentMutation = () => {
    return useMutation({
        mutationFn: async (request: PaymentIntentRequest) => {
            return await new PaymentClient().createPaymentIntent(request);
        },
    });
};

export const useCreatePaymentMutation = () => {
    return useMutation({
        mutationFn: async (command: CreatePaymentCommand) => {
            return await new PaymentClient().createPayment(command);
        },
    });
};
