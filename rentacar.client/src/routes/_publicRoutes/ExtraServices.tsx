/* eslint-disable @typescript-eslint/no-explicit-any */
import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useFetchExtraServicesQuery } from "../../api/extraServices/extraServices";
import { Button, Card, Switch } from "antd";
import { SearchFilter } from "../../components/search/Search";
import { useFetchVehicleByIdQuery } from "../../api/vehicles/vehicles";
import { useCallback, useMemo, useState } from "react";
import { useCreatePaymentIntentMutation } from "../../api/payments/payments";
import { PaymentRequest } from "../../api/api";

export const Route = createFileRoute("/_publicRoutes/ExtraServices")({
    component: ExtraServices,
});

function ExtraServices() {
    const [extraServicePrice, setExtraServicePrice] = useState<number>(0);

    const navigate = useNavigate();
    const search: SearchFilter = Route.useSearch();

    const { data: extraServices } = useFetchExtraServicesQuery();
    const { data: vehicle } = useFetchVehicleByIdQuery(search.vehicleId);

    const { mutateAsync: createPaymentIntent } =
        useCreatePaymentIntentMutation();

    const pickupDate = useMemo(() => {
        return new Date(search.pickupDate as any);
    }, [search.pickupDate]);
    const dropOffDate = useMemo(() => {
        return new Date(search.dropOffDate as any);
    }, [search.dropOffDate]);

    const daysOfRent = useMemo(() => {
        return (
            (dropOffDate.getTime() - pickupDate.getTime()) /
            (1000 * 60 * 60 * 24)
        );
    }, [dropOffDate, pickupDate]);

    // #region Callbacks

    const handleToggleExtraService = useCallback(
        (checked: boolean, price: number) => {
            setExtraServicePrice((prev) => {
                return checked ? prev + price : prev - price;
            });
        },
        []
    );

    const handleBook = useCallback(async () => {
        if (!vehicle) return;

        const response = await createPaymentIntent({
            amount: (vehicle.price + extraServicePrice) * daysOfRent,
        } as PaymentRequest);

        navigate({
            to: "/Payment",
            search: {
                clientSecret: response.clientSecret,
            },
        });
    }, [createPaymentIntent, daysOfRent, extraServicePrice, navigate, vehicle]);

    // #endregion

    if (!vehicle) return;

    return (
        <div
            style={{
                maxWidth: 1200,
                margin: "0 auto",
                padding: 24,
                display: "flex",
            }}
        >
            <div>
                <h2>Extra Services</h2>
                {extraServices?.map((service, index) => (
                    <Card
                        key={index}
                        title={
                            <b
                                style={{
                                    display: "flex",
                                    justifyContent: "space-between",
                                }}
                            >
                                {service.name}
                                <Switch
                                    onChange={(checked) =>
                                        handleToggleExtraService(
                                            checked,
                                            service.price
                                        )
                                    }
                                />
                            </b>
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
            </div>
            <div style={{ marginTop: 68 }}>
                <Card
                    title="Price Summary"
                    style={{
                        width: 300,
                        marginLeft: 32,
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
                            fontSize: 16,
                        }}
                    >
                        <span>Total:</span>
                        <span>
                            €{(vehicle.price + extraServicePrice) * daysOfRent}
                        </span>
                    </div>
                </Card>
                <Button
                    style={{
                        width: 150,
                        marginTop: 15,
                        marginLeft: 107,
                        borderRadius: "12px",
                        boxShadow: "0 4px 12px rgba(0, 0, 0, 0.08)",
                    }}
                    type="primary"
                    onClick={handleBook}
                >
                    Book
                </Button>
            </div>
        </div>
    );
}
