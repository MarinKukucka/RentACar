import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useFetchTodaysReservationsQuery } from "../../../api/reservations/reservations";
import { useFetchTodaysRentalsQuery } from "../../../api/rentals/rentals";
import { Card, List, Spin } from "antd";
import { formatDateTime } from "../../../helpers/FormatHelper";
import { useTranslation } from "react-i18next";
import translations from "../../../config/localization/translations";

export const Route = createFileRoute("/_authorizedRoutes/dashboard/")({
    component: Dashboard,
});

function Dashboard() {
    const { t } = useTranslation();
    const navigate = useNavigate({ from: Route.fullPath });

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
                                    title={"#" + reservation.id}
                                    extra={formatDateTime(
                                        reservation.startDateTime
                                    )}
                                    onClick={() =>
                                        navigate({
                                            to: "/reservations/$id/$tab",
                                            params: {
                                                id: reservation.id.toString(),
                                                tab: "details",
                                            },
                                        })
                                    }
                                >
                                    <div>{reservation.personName}</div>
                                    <hr />
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
                                    title={"#" + rental.id}
                                    extra={formatDateTime(
                                        rental.reservationEnd
                                    )}
                                >
                                    <div>{rental.personName}</div>
                                </Card>
                            </List.Item>
                        )}
                    />
                )}
            </Card>
        </div>
    );
}
