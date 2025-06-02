import {
    createRootRoute,
    Outlet,
    useRouterState,
} from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { isAuthenticated } from "../helpers/UserHelper";
import AuthLayout from "../components/layout/auth/AuthLayout";
import { Spin } from "antd";
import PublicLayout from "../components/layout/public/PublicLayout";

export const Route = createRootRoute({
    component: RouteLayout,
});

function RouteLayout() {
    const [isAuth, setIsAuth] = useState<boolean>(false);

    const pathname = useRouterState({
        select: (state) => state.location.pathname,
    });

    useEffect(() => {
        isAuthenticated().then(setIsAuth);
        const onChange = () => isAuthenticated().then(setIsAuth);
        window.addEventListener("authChange", onChange);
        return () => window.removeEventListener("authChange", onChange);
    }, []);

    if (isAuth === undefined) return <Spin />;

    if (pathname === "/Login") return <Outlet />;

    const Wrapper = isAuth ? AuthLayout : PublicLayout;

    return (
        <Wrapper>
            <Outlet />
        </Wrapper>
    );
}
