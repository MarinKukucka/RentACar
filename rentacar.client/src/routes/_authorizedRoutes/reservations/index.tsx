import { createFileRoute } from "@tanstack/react-router";
import Reservations from "../../../components/reservations/Reservations";

export const Route = createFileRoute("/_authorizedRoutes/reservations/")({
    component: ReservationsGeneralView,
});

function ReservationsGeneralView() {
    return <Reservations />;
}

export default ReservationsGeneralView;
