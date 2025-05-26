import { createRootRoute, Outlet } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { isAuthenticated } from "../helpers/UserHelper";
import AuthLayout from "../components/layout/AuthLayout";
import PublicLayout from "../components/layout/PublicLayout";
import { Spin } from "antd";

export const Route = createRootRoute({
    component: RouteLayout,
});

function RouteLayout() {
    const [isAuth, setIsAuth] = useState<boolean>(false);

    useEffect(() => {
        isAuthenticated().then(setIsAuth);
        const onChange = () => isAuthenticated().then(setIsAuth);
        window.addEventListener("authChange", onChange);
        return () => window.removeEventListener("authChange", onChange);
    }, []);

    if (isAuth === undefined) return <Spin />;

    const Wrapper = isAuth ? AuthLayout : PublicLayout;

    return (
        <Wrapper>
            <Outlet />
        </Wrapper>
    );
}
