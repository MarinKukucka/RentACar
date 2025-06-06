/* eslint-disable @typescript-eslint/no-explicit-any */
import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useCallback, useMemo, useState } from "react";
import { Button, Card, Col, Form, Input, Row, Switch } from "antd";
import { SearchFilter } from "../../components/search/Search";
import { CreateReservationCommand, PaymentIntentRequest } from "../../api/api";
import { useFetchExtraServicesQuery } from "../../api/extraServices/extraServices";
import { useFetchVehicleByIdQuery } from "../../api/vehicles/vehicles";
import { useCreatePaymentIntentMutation } from "../../api/payments/payments";
import { useCreateReservationMutation } from "../../api/reservations/reservations";

export const Route = createFileRoute("/_publicRoutes/ExtraServices")({
    component: ExtraServices,
});

function ExtraServices() {
    const [extraServicePrice, setExtraServicePrice] = useState(0);
    const [selectedExtras, setSelectedExtras] = useState<number[]>([]);
    const [form] = Form.useForm();

    const navigate = useNavigate();
    const search: SearchFilter = Route.useSearch();

    const { data: extraServices } = useFetchExtraServicesQuery();
    const { data: vehicle } = useFetchVehicleByIdQuery(search.vehicleId);

    const { mutateAsync: createPaymentIntent } =
        useCreatePaymentIntentMutation();
    const { mutateAsync: createReservation } = useCreateReservationMutation();

    const pickupDate = useMemo(
        () => new Date(search.pickupDate as any),
        [search.pickupDate]
    );
    const dropOffDate = useMemo(
        () => new Date(search.dropOffDate as any),
        [search.dropOffDate]
    );

    const daysOfRent = useMemo(() => {
        return (
            (dropOffDate.getTime() - pickupDate.getTime()) /
                (1000 * 60 * 60 * 24) +
            1
        );
    }, [pickupDate, dropOffDate]);

    const handleToggleExtraService = useCallback(
        (checked: boolean, serviceId: number, price: number) => {
            setExtraServicePrice((prev) =>
                checked ? prev + price : prev - price
            );
            setSelectedExtras((prev) =>
                checked
                    ? [...prev, serviceId]
                    : prev.filter((id) => id !== serviceId)
            );
        },
        []
    );

    const handleBook = useCallback(async () => {
        if (!vehicle) return;

        try {
            const values = await form.validateFields();
            const price = (vehicle.price + extraServicePrice) * daysOfRent;

            const response = await createPaymentIntent({
                amount: price,
            } as PaymentIntentRequest);

            const reservationId = await createReservation({
                startDateTime: pickupDate,
                endDateTime: dropOffDate,
                totalPrice: price,
                vehicleId: search.vehicleId,
                pickupLocationId: search.pickupLocationId,
                reservationExtrasIds: selectedExtras,
                ...values,
            } as CreateReservationCommand);

            navigate({
                to: "/Payment",
                search: {
                    clientSecret: response.clientSecret,
                    paymentIntentId: response.paymentIntentId,
                    reservationId,
                },
            });
        } catch (err) {
            console.error("Form validation failed:", err);
        }
    }, [
        createPaymentIntent,
        createReservation,
        daysOfRent,
        dropOffDate,
        extraServicePrice,
        form,
        navigate,
        pickupDate,
        search.pickupLocationId,
        search.vehicleId,
        selectedExtras,
        vehicle,
    ]);

    if (!vehicle) return;

    return (
        <div style={{ maxWidth: 1200, margin: "0 auto", padding: 16 }}>
            <Row gutter={[24, 24]} wrap>
                {/* Left side: Form & Extras */}
                <Col xs={24} md={16}>
                    <h2>Your Info</h2>
                    <Card
                        style={{
                            marginBottom: 16,
                            borderRadius: "12px",
                            boxShadow: "0 4px 12px rgba(0, 0, 0, 0.05)",
                        }}
                    >
                        <Form
                            form={form}
                            labelCol={{ span: 6 }}
                            layout="vertical"
                        >
                            <Form.Item
                                label="First Name"
                                name="firstName"
                                rules={[
                                    {
                                        required: true,
                                        message: "Please enter your first name",
                                    },
                                ]}
                            >
                                <Input />
                            </Form.Item>
                            <Form.Item
                                label="Last Name"
                                name="lastName"
                                rules={[
                                    {
                                        required: true,
                                        message: "Please enter your last name",
                                    },
                                ]}
                            >
                                <Input />
                            </Form.Item>
                            <Form.Item
                                label="Phone Number"
                                name="phoneNumber"
                                rules={[
                                    {
                                        required: true,
                                        message:
                                            "Please enter your phone number",
                                    },
                                ]}
                            >
                                <Input />
                            </Form.Item>
                            <Form.Item
                                label="Email"
                                name="email"
                                rules={[
                                    {
                                        required: true,
                                        message: "Please enter your email",
                                    },
                                    {
                                        type: "email",
                                        message: "Invalid email format",
                                    },
                                ]}
                            >
                                <Input />
                            </Form.Item>
                            <Form.Item label="Notes" name="notes">
                                <Input.TextArea rows={4} />
                            </Form.Item>
                        </Form>
                    </Card>

                    <h2>Extra Services</h2>
                    {extraServices?.map((service) => (
                        <Card
                            key={service.id}
                            title={
                                <div
                                    style={{
                                        display: "flex",
                                        justifyContent: "space-between",
                                    }}
                                >
                                    <b>{service.name}</b>
                                    <Switch
                                        onChange={(checked) =>
                                            handleToggleExtraService(
                                                checked,
                                                service.id,
                                                service.price
                                            )
                                        }
                                    />
                                </div>
                            }
                            style={{
                                marginBottom: 16,
                                borderRadius: "12px",
                                boxShadow: "0 4px 12px rgba(0, 0, 0, 0.05)",
                            }}
                        >
                            <p>{service.description}</p>
                            <p>
                                <strong>Price:</strong> €{service.price}/day
                            </p>
                        </Card>
                    ))}
                </Col>

                {/* Right side: Summary */}
                <Col xs={24} md={8}>
                    <Card
                        title="Price Summary"
                        style={{
                            borderRadius: "12px",
                            boxShadow: "0 4px 12px rgba(0, 0, 0, 0.08)",
                        }}
                    >
                        <div
                            style={{
                                display: "flex",
                                justifyContent: "space-between",
                                marginBottom: 8,
                            }}
                        >
                            <span>Vehicle:</span>
                            <span>
                                €{vehicle.price}/day × {daysOfRent} = €
                                {vehicle.price * daysOfRent}
                            </span>
                        </div>
                        <div
                            style={{
                                display: "flex",
                                justifyContent: "space-between",
                                marginBottom: 8,
                            }}
                        >
                            <span>Extras:</span>
                            <span>€{extraServicePrice * daysOfRent}</span>
                        </div>
                        <hr style={{ margin: "12px 0" }} />
                        <div
                            style={{
                                display: "flex",
                                justifyContent: "space-between",
                                fontWeight: 600,
                            }}
                        >
                            <span>Total:</span>
                            <span>
                                €
                                {(vehicle.price + extraServicePrice) *
                                    daysOfRent}
                            </span>
                        </div>
                    </Card>
                    <Button
                        type="primary"
                        block
                        style={{ marginTop: 16, borderRadius: "12px" }}
                        onClick={handleBook}
                    >
                        Book
                    </Button>
                </Col>
            </Row>
        </div>
    );
}
