import {
    useStripe,
    useElements,
    PaymentElement,
} from "@stripe/react-stripe-js";
import { Button } from "antd";
import { useState } from "react";

function CheckoutForm() {
    const stripe = useStripe();
    const elements = useElements();
    const [loading, setLoading] = useState(false);

    const reservationId = new URLSearchParams(window.location.search).get(
        "reservationId"
    );

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!stripe || !elements) return;

        setLoading(true);

        const { error } = await stripe.confirmPayment({
            elements,
            confirmParams: {
                return_url: `${window.location.origin}/Success?reservationId=${reservationId}`,
            },
        });

        if (error || !reservationId) {
            console.error("GREŠKAAAAAA");
            console.error(error.message);
        }

        setLoading(false);
    };

    return (
        <form onSubmit={handleSubmit}>
            <PaymentElement />
            <Button
                type="primary"
                htmlType="submit"
                loading={loading}
                style={{ marginTop: 24 }}
            >
                Pay
            </Button>
        </form>
    );
}

export default CheckoutForm;
