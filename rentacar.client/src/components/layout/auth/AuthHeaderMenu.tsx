import {
    CarOutlined,
    GlobalOutlined,
    LoginOutlined,
    LogoutOutlined,
    UserOutlined,
} from "@ant-design/icons";
import { Link, useNavigate } from "@tanstack/react-router";
import { Dropdown, Menu, MenuProps } from "antd";
import {
    ADMIN,
    checkUserInRole,
    isAuthenticated,
} from "../../../helpers/UserHelper";
import { useLogoutMutation } from "../../../api/auth/auth";
import { useCallback, useEffect, useState } from "react";
import LanguagesMenu from "../LanguagesMenu";
import { useTranslation } from "react-i18next";
import translations from "../../../config/localization/translations";

type MenuItem = Required<MenuProps>["items"][number];

function AuthHeaderMenu() {
    const [isAdmin, setIsAdmin] = useState<boolean>();
    const [isAuth, setIsAuth] = useState<boolean | null>(null);

    const { t } = useTranslation();
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
                label: (
                    <Link to="/vehicles">{t(translations.vehicles.title)}</Link>
                ),
            },
            {
                key: "profile",
                icon: <UserOutlined />,
                label: (
                    <Link to="/Profile">{t(translations.profile.title)}</Link>
                ),
            },
            {
                key: "languages",
                icon: <GlobalOutlined />,
                label: (
                    <Dropdown dropdownRender={() => <LanguagesMenu />}>
                        {t(translations.general.language)}
                    </Dropdown>
                ),
            },
            {
                key: "logout",
                icon: <LogoutOutlined />,
                label: (
                    <Link to="/" onClick={handleLogout}>
                        {t(translations.authorization.logout)}
                    </Link>
                ),
            },
        ];
        if (isAdmin) {
            items = [
                {
                    key: "people",
                    icon: <UserOutlined />,
                    label: (
                        <Link to="/people">{t(translations.people.title)}</Link>
                    ),
                },
                ...items,
            ];
        }
    } else {
        items = [
            {
                key: "login",
                icon: <LoginOutlined />,
                label: (
                    <Link to="/Login">
                        {t(translations.authorization.login)}
                    </Link>
                ),
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

export default AuthHeaderMenu;
