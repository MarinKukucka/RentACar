/* eslint-disable @typescript-eslint/no-explicit-any */
import { createFileRoute } from "@tanstack/react-router";
import { useUpdateReservationMutation } from "../../api/reservations/reservations";
import { useEffect, useRef, useState } from "react";
import {
    CreatePaymentCommand,
    ReservationStatus,
    UpdateReservationCommand,
} from "../../api/api";
import { loadStripe } from "@stripe/stripe-js";
import { useCreatePaymentMutation } from "../../api/payments/payments";
import FileLink from "../../components/files/FileLink";
import { Button, Card, Spin } from "antd";

export const Route = createFileRoute("/_publicRoutes/Success")({
    component: Success,
});

const stripePromise = loadStripe(
    "pk_test_51RUtpZPLso2uXaSusaprKtjApnh68VxPp9LUrgzy84dSqDV0nh52dFbUByj5tfIAuwhoMhR8GcytVEcf2162aEng00KAwJgRva"
);

function Success() {
    const [filePath, setFilePath] = useState<string>();
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string>();

    const { mutateAsync: updateReservation } = useUpdateReservationMutation();
    const { mutateAsync: createPayment } = useCreatePaymentMutation();

    const didRunRef = useRef(false);

    useEffect(() => {
        if (didRunRef.current) return;
        didRunRef.current = true;
        const checkPayment = async () => {
            try {
                const params = new URLSearchParams(window.location.search);
                const clientSecret = params.get("payment_intent_client_secret");
                const reservationId = params.get("reservationId");
                const paymentIntentId = params.get("paymentIntentId");

                if (!clientSecret || !reservationId || !paymentIntentId) {
                    throw new Error("Missing payment parameters.");
                }

                const stripe = await stripePromise;
                if (!stripe) throw new Error("Stripe failed to initialize.");

                const { paymentIntent } =
                    await stripe.retrievePaymentIntent(clientSecret);
                const id = Number(reservationId);

                if (paymentIntent?.status === "succeeded") {
                    await updateReservation({
                        id,
                        status: ReservationStatus.Confirmed,
                        confirmedAt: new Date(),
                        cancelledAt: undefined,
                    } as UpdateReservationCommand);

                    const response = await createPayment({
                        amount: paymentIntent.amount / 100,
                        stripePaymentIntentId: paymentIntentId,
                        reservationId: id,
                    } as CreatePaymentCommand);

                    setFilePath(response.invoicePath);
                } else {
                    await updateReservation({
                        id,
                        status: ReservationStatus.Cancelled,
                        confirmedAt: new Date(),
                        cancelledAt: new Date(),
                    } as UpdateReservationCommand);
                    setError("Payment was not successful.");
                }
            } catch (err: any) {
                console.error(err);
                setError(err.message || "An unknown error occurred.");
            } finally {
                setLoading(false);
            }
        };

        checkPayment();
    }, [createPayment, updateReservation]);

    return (
        <div
            style={{
                height: "86vh",
                display: "flex",
                justifyContent: "center",
                alignItems: "center",
            }}
        >
            <Card>
                {loading && (
                    <div>
                        <p>Processing your payment...</p>
                        <Spin />
                    </div>
                )}

                {!loading && filePath && (
                    <>
                        <h2>Payment Successful!</h2>
                        <p style={{ margin: "50px 0px" }}>
                            Thank you for your purchase. Your reservation is
                            confirmed.
                        </p>
                        <div
                            style={{
                                display: "flex",
                                justifyContent: "space-between",
                            }}
                        >
                            <FileLink
                                filePath={filePath}
                                fileName="Your invoice"
                            />
                            <Button
                                onClick={() => (window.location.href = "/")}
                            >
                                Back to Home
                            </Button>
                        </div>
                    </>
                )}

                {!loading && error && (
                    <>
                        <h2>Payment Failed</h2>
                        <p>{error}</p>
                        <Button onClick={() => window.location.reload()}>
                            Retry
                        </Button>
                    </>
                )}
            </Card>
        </div>
    );
}

export default Success;
