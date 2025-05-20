import {
    CarOutlined,
    LoginOutlined,
    LogoutOutlined,
    UserOutlined,
} from "@ant-design/icons";
import { Link, useNavigate } from "@tanstack/react-router";
import { Menu, MenuProps } from "antd";
import {
    ADMIN,
    checkUserInRole,
    isAuthenticated,
} from "../../helpers/UserHelper";
import { useLogoutMutation } from "../../api/auth/auth";
import { useCallback, useEffect, useState } from "react";

type MenuItem = Required<MenuProps>["items"][number];

function HeaderMenu() {
    const [isAdmin, setIsAdmin] = useState<boolean>();
    const [isAuth, setIsAuth] = useState<boolean | null>(null);

    const navigate = useNavigate();

    const { mutateAsync: logout } = useLogoutMutation();

    useEffect(() => {
        isAuthenticated().then(setIsAuth);

        checkUserInRole([ADMIN]).then(setIsAdmin);
    }, []);

    // #region Callbacks

    const handleLogout = useCallback(async () => {
        try {
            await logout();
            window.dispatchEvent(new Event("authChange"));
            navigate({ to: "/" });
        } catch {
            console.log("Failed");
        }
    }, [logout, navigate]);

    // #endregion

    let items: MenuItem[] = [];

    if (isAuth) {
        items = [
            {
                key: "vehicles",
                icon: <CarOutlined />,
                label: <Link to="/vehicles">VEHICLES</Link>,
            },
            {
                key: "profile",
                icon: <UserOutlined />,
                label: <Link to="/Profile">PROFILE</Link>,
            },
            {
                key: "logout",
                icon: <LogoutOutlined />,
                label: (
                    <Link to="/" onClick={handleLogout}>
                        LOG OUT
                    </Link>
                ),
            },
        ];
        if (isAdmin) {
            items = [
                {
                    key: "people",
                    icon: <UserOutlined />,
                    label: <Link to="/people">PEOPLE</Link>,
                },
                ...items,
            ];
        }
    } else {
        items = [
            {
                key: "login",
                icon: <LoginOutlined />,
                label: <Link to="/Login">Log in</Link>,
            },
        ];
    }

    return (
        <Menu
            theme="dark"
            mode="horizontal"
            items={items}
            className="header-menu"
        />
    );
}

export default HeaderMenu;
