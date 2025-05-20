import { createFileRoute } from "@tanstack/react-router";
import Vehicles from "../../../components/vehicles/Vehicles";

export const Route = createFileRoute("/_authorizedRoutes/vehicles/")({
    component: VehiclesGeneralView,
});

function VehiclesGeneralView() {
    return <Vehicles />;
}
