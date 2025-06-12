import { PageHeader } from "@ant-design/pro-layout";
import { createFileRoute, useRouter } from "@tanstack/react-router";
import { Tabs } from "antd";
import { useTranslation } from "react-i18next";
import translations from "../../../../config/localization/translations";
import RentalDetails from "../../../../components/rentals/RentalDetails";
import { useFetchRentalByIdQuery } from "../../../../api/rentals/rentals";

export const Route = createFileRoute("/_authorizedRoutes/rentals/$id/$tab")({
    component: RentalPage,
});

function RentalPage() {
    const { t } = useTranslation();
    const router = useRouter();

    const { id, tab } = Route.useParams();

    const { data: rental } = useFetchRentalByIdQuery(+id);

    return (
        <>
            <PageHeader title={"Rental #" + rental?.id} />
            <Tabs
                onChange={(activeKey: string) => {
                    router.navigate({
                        to: "/rentals/$id/$tab",
                        params: { id: id, tab: activeKey },
                    });
                }}
                activeKey={tab ?? "details"}
                defaultActiveKey="details"
                items={[
                    {
                        key: "details",
                        label: t(translations.general.details),
                        children: <RentalDetails rental={rental} />,
                        destroyInactiveTabPane: true,
                    },
                ]}
            />
        </>
    );
}
