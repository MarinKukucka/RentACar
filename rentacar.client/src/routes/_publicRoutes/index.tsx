import { createFileRoute } from "@tanstack/react-router";
import { Layout } from "antd";
import VehiclesCarousel from "../../components/vehicles/VehiclesCarousel";
import LocationsShow from "../../components/locations/LocationsShow";
import Search from "../../components/search/Search";

export const Route = createFileRoute("/_publicRoutes/")({
    component: MainPage,
});

const { Content } = Layout;

function MainPage() {
    return (
        <Layout>
            <Content style={{ padding: "50px 50px" }}>
                <Search />

                <VehiclesCarousel />

                <LocationsShow />
            </Content>
        </Layout>
    );
}
