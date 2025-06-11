import { createFileRoute } from "@tanstack/react-router";
import { useFetchTodaysReservationsQuery } from "../../../api/reservations/reservations";
import { useFetchTodaysRentalsQuery } from "../../../api/rentals/rentals";
import { Card, Divider, List, Spin } from "antd";
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
        <>
            <Card>
                {reservationsLoading ? (
                    <Spin size="large" />
                ) : (
                    <List
                        grid={{ gutter: 16, column: 4 }}
                        dataSource={reservations}
                        renderItem={(reservation) => (
                            <List.Item>
                                <Card
                                    extra={formatDate(
                                        reservation.startDateTime
                                    )}
                                    title={t(translations.reservations.title)}
                                >
                                    <p>
                                        {reservation.id}
                                        {formatDate(reservation.startDateTime)}
                                        <Divider />
                                        <p>{reservation.notes}</p>
                                    </p>
                                </Card>
                            </List.Item>
                        )}
                    />
                )}
            </Card>

            <Card>
                {rentalsLoading ? (
                    <Spin size="large" />
                ) : (
                    <List
                        grid={{ gutter: 16, column: 4 }}
                        dataSource={rentals}
                        renderItem={(rental) => (
                            <List.Item>
                                <Card
                                    extra={formatDate(rental.returnDateTime)}
                                    title={t(translations.rentals.title)}
                                >
                                    <p>
                                        {rental.id}
                                        {formatDate(rental.returnDateTime)}
                                        <Divider />
                                        <p>{rental.notes}</p>
                                    </p>
                                </Card>
                            </List.Item>
                        )}
                    />
                )}
            </Card>
        </>
    );
}
