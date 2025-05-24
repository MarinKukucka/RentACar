import { createFileRoute, redirect } from "@tanstack/react-router";
import { ADMIN, checkUserInRole } from "../../../helpers/UserHelper";
import People from "../../../components/people/People";

export const Route = createFileRoute("/_authorizedRoutes/people/")({
    beforeLoad: async () => {
        if (!(await checkUserInRole([ADMIN]))) throw redirect({ to: "/" });
    },
    component: PeopleGeneralView,
});

function PeopleGeneralView() {
    return <People />;
}
