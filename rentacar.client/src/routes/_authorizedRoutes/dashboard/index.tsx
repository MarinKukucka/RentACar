import { createFileRoute } from "@tanstack/react-router";
import { useFetchTodaysReservationsQuery } from "../../../api/reservations/reservations";
import { useFetchTodaysRentalsQuery } from "../../../api/rentals/rentals";
import { Card, List, Spin } from "antd";
import { formatDate } from "../../../helpers/FormatHelper";
import { useTranslation } from "react-i18next";
import translations from "../../../config/localization/translations";

export const Route = createFileRoute("/_authorizedRoutes/dashboard/")({
    component: Dashboard,
});

function Dashboard() {
    const { t } = useTranslation();

    const { data: reservations, isLoading: reservationsLoading } =
        useFetchTodaysReservationsQuery();
    const { data: rentals, isLoading: rentalsLoading } =
        useFetchTodaysRentalsQuery();

    return (
        <div style={{ display: "flex", flexDirection: "column", gap: 50 }}>
            <Card title={t(translations.reservations.title)}>
                {reservationsLoading ? (
                    <Spin size="large" />
                ) : (
                    <List
                        grid={{ gutter: 16, column: 4 }}
                        dataSource={reservations}
                        renderItem={(reservation) => (
                            <List.Item>
                                <Card
                                    title={reservation.id}
                                    extra={formatDate(
                                        reservation.startDateTime
                                    )}
                                >
                                    <p>{reservation.notes}</p>
                                </Card>
                            </List.Item>
                        )}
                    />
                )}
            </Card>

            <Card title={t(translations.rentals.title)}>
                {rentalsLoading ? (
                    <Spin size="large" />
                ) : (
                    <List
                        grid={{ gutter: 16, column: 4 }}
                        dataSource={rentals}
                        renderItem={(rental) => (
                            <List.Item>
                                <Card
                                    title={rental.id}
                                    extra={formatDate(rental.returnDateTime)}
                                >
                                    <p>{rental.notes}</p>
                                </Card>
                            </List.Item>
                        )}
                    />
                )}
            </Card>
        </div>
    );
}
