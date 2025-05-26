import { Layout as AntLayout, theme } from "antd";
import { Header } from "antd/es/layout/layout";
import { Link, Outlet } from "@tanstack/react-router";
import HeaderMenu from "./HeaderMenu";
import "./Layout.css";

const { Content } = AntLayout;

function AuthLayout() {
    const {
        token: { colorBgContainer, borderRadiusLG },
    } = theme.useToken();

    return (
        <AntLayout style={{ minHeight: "100vh" }}>
            <Header className="header-layout">
                <div className="logo">
                    <Link className="logo-link" to="/">
                        <img
                            src="src\assets\logo.png"
                            style={{ width: "100%" }}
                        />
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
