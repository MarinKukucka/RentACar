import { Layout as AntLayout, theme } from "antd";
import { Header } from "antd/es/layout/layout";
import { Link, Outlet } from "@tanstack/react-router";
import HeaderMenu from "./AuthHeaderMenu";
import "../Layout.css";
import { CarOutlined } from "@ant-design/icons";
import { useTranslation } from "react-i18next";
import translations from "../../../config/localization/translations";

const { Content } = AntLayout;

function AuthLayout() {
    const {
        token: { colorBgContainer, borderRadiusLG },
    } = theme.useToken();
    const { t } = useTranslation();

    return (
        <AntLayout style={{ minHeight: "100vh" }}>
            <Header className="header-layout">
                <div className="logo">
                    <Link
                        to="/dashboard"
                        style={{ color: "white", fontSize: "1.2rem" }}
                    >
                        <CarOutlined style={{ marginRight: "0.5rem" }} />
                        {t(translations.general.appName)}
                    </Link>
                </div>
                <HeaderMenu />
            </Header>

            <Content
                style={{
                    backgroundColor: "#fff",
                    margin: "24px 16px",
                    padding: 24,
                    background: colorBgContainer,
                    borderRadius: borderRadiusLG,
                }}
            >
                <Outlet />
            </Content>
        </AntLayout>
    );
}

export default AuthLayout;
