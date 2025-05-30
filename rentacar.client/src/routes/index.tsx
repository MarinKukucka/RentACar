/* eslint-disable @typescript-eslint/no-explicit-any */
import { createFileRoute } from "@tanstack/react-router";
import { Layout } from "antd";
import VehiclesCarousel from "../components/vehicles/VehiclesCarousel";
import LocationsShow from "../components/locations/LocationsShow";
import Search from "../components/search/Search";

export const Route = createFileRoute("/")({
    component: MainPage,
});

const { Content, Footer } = Layout;

function MainPage() {
    return (
        <Layout>
            <Content style={{ padding: "100px 50px 50px" }}>
                <Search />

                <VehiclesCarousel />

                <LocationsShow />
            </Content>

            <Footer style={{ textAlign: "center" }}>
                Rent A Car ©2025 Created by Marin Kukučka
            </Footer>
        </Layout>
    );
}
