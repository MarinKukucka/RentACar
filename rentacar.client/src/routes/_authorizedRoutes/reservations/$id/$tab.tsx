import { PageHeader } from "@ant-design/pro-layout";
import { createFileRoute, useRouter } from "@tanstack/react-router";
import { Tabs } from "antd";
import { useTranslation } from "react-i18next";
import translations from "../../../../config/localization/translations";
import { useFetchReservationByIdQuery } from "../../../../api/reservations/reservations";
import ReservationDetails from "../../../../components/reservations/ReservationDetails";

export const Route = createFileRoute(
    `/_authorizedRoutes/reservations/$id/$tab`
)({
    component: OfferPage,
});

function OfferPage() {
    const { t } = useTranslation();
    const router = useRouter();

    const { id, tab } = Route.useParams();

    const { data: reservation } = useFetchReservationByIdQuery(+id);

    return (
        <>
            <PageHeader title={reservation?.id} />
            <Tabs
                onChange={(activeKey: string) => {
                    router.navigate({
                        to: "/reservations/$id/$tab",
                        params: { id: id, tab: activeKey },
                    });
                }}
                activeKey={tab ?? "details"}
                defaultActiveKey="details"
                items={[
                    {
                        key: "details",
                        label: t(translations.general.details),
                        children: (
                            <ReservationDetails reservation={reservation} />
                        ),
                        destroyInactiveTabPane: true,
                    },
                ]}
            />
        </>
    );
}

export default OfferPage;
