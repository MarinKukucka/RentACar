import { createFileRoute } from "@tanstack/react-router";
import { Card } from "antd";
import { Elements } from "@stripe/react-stripe-js";
import { loadStripe } from "@stripe/stripe-js";
import CheckoutForm from "../../components/payment/CheckoutForm";

export const Route = createFileRoute("/_publicRoutes/Payment")({
    component: Payment,
});

const stripePromise = loadStripe(
    "pk_test_51RUtpZPLso2uXaSusaprKtjApnh68VxPp9LUrgzy84dSqDV0nh52dFbUByj5tfIAuwhoMhR8GcytVEcf2162aEng00KAwJgRva"
);

function Payment() {
    const clientSecret = new URLSearchParams(window.location.search).get(
        "clientSecret"
    );

    if (!clientSecret) return <p>Missing client secret</p>;

    return (
        <div style={{ maxWidth: 600, margin: "0 auto", padding: 24 }}>
            <Card>
                <Elements stripe={stripePromise} options={{ clientSecret }}>
                    <CheckoutForm />
                </Elements>
            </Card>
        </div>
    );
}
