import { createFileRoute } from "@tanstack/react-router";
import Rentals from "../../../components/rentals/Rentals";

export const Route = createFileRoute("/_authorizedRoutes/rentals/")({
    component: RentalsGeneralView,
});

function RentalsGeneralView() {
    return <Rentals />;
}
