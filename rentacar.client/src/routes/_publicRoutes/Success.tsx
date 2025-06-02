import { createFileRoute } from "@tanstack/react-router";
import { useUpdateReservationMutation } from "../../api/reservations/reservations";
import { useEffect } from "react";
import { ReservationStatus, UpdateReservationCommand } from "../../api/api";
import { loadStripe } from "@stripe/stripe-js";

export const Route = createFileRoute("/_publicRoutes/Success")({
    component: Success,
});

const stripePromise = loadStripe(
    "pk_test_51RUtpZPLso2uXaSusaprKtjApnh68VxPp9LUrgzy84dSqDV0nh52dFbUByj5tfIAuwhoMhR8GcytVEcf2162aEng00KAwJgRva"
);

function Success() {
    const { mutateAsync: updateReservation } = useUpdateReservationMutation();

    useEffect(() => {
        const checkPayment = async () => {
            const clientSecret = new URLSearchParams(
                window.location.search
            ).get("payment_intent_client_secret");
            const reservationId = new URLSearchParams(
                window.location.search
            ).get("reservationId");
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
                }
            }
        };

        checkPayment();
    }, [updateReservation]);

    return <div>Thank you! Your payment was successful.</div>;
}

export default Success;
