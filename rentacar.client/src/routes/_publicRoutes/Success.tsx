import { createFileRoute } from "@tanstack/react-router";
import { useUpdateReservationMutation } from "../../api/reservations/reservations";
import { useEffect, useState } from "react";
import {
    CreatePaymentCommand,
    ReservationStatus,
    UpdateReservationCommand,
} from "../../api/api";
import { loadStripe } from "@stripe/stripe-js";
import { useCreatePaymentMutation } from "../../api/payments/payments";
import FileLink from "../../components/files/FileLink";

export const Route = createFileRoute("/_publicRoutes/Success")({
    component: Success,
});

const stripePromise = loadStripe(
    "pk_test_51RUtpZPLso2uXaSusaprKtjApnh68VxPp9LUrgzy84dSqDV0nh52dFbUByj5tfIAuwhoMhR8GcytVEcf2162aEng00KAwJgRva"
);

function Success() {
    const [filePath, setFilePath] = useState<string | undefined>();

    const { mutateAsync: updateReservation } = useUpdateReservationMutation();
    const { mutateAsync: createPayment } = useCreatePaymentMutation();

    useEffect(() => {
        const checkPayment = async () => {
            const clientSecret = new URLSearchParams(
                window.location.search
            ).get("payment_intent_client_secret");
            const reservationId = new URLSearchParams(
                window.location.search
            ).get("reservationId");
            const paymentIntentId = new URLSearchParams(
                window.location.search
            ).get("paymentIntentId");

            const stripe = await stripePromise;

            if (stripe && clientSecret && reservationId) {
                const { paymentIntent } =
                    await stripe.retrievePaymentIntent(clientSecret);
                if (paymentIntent?.status === "succeeded") {
                    await updateReservation({
                        id: +reservationId,
                        status: ReservationStatus.Confirmed,
                        confirmedAt: new Date(),
                        cancelledAt: undefined,
                    } as UpdateReservationCommand);

                    const response = await createPayment({
                        amount: 120,
                        stripePaymentIntentId: paymentIntentId,
                        reservationId: +reservationId,
                    } as CreatePaymentCommand);

                    setFilePath(response.invoicePath);
                } else {
                    await updateReservation({
                        id: +reservationId,
                        status: ReservationStatus.Cancelled,
                        confirmedAt: new Date(),
                        cancelledAt: new Date(),
                    } as UpdateReservationCommand);
                }
            }
        };

        checkPayment();
    }, [createPayment, updateReservation]);

    return (
        <>
            {filePath && (
                <div>
                    <FileLink filePath={filePath} fileName="Invoice" />
                    Thank you! Your payment was successful.
                </div>
            )}
        </>
    );
}

export default Success;
