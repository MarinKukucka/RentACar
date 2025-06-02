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

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!stripe || !elements) return;

        setLoading(true);

        const { error } = await stripe.confirmPayment({
            elements,
            confirmParams: {
                return_url: window.location.origin + "/success",
            },
        });

        if (error) {
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
