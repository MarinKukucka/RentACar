import { CarOutlined, GlobalOutlined } from "@ant-design/icons";
import { Header } from "antd/es/layout/layout";
import { useTranslation } from "react-i18next";
import translations from "../../../config/localization/translations";
import { Dropdown, Menu } from "antd";
import LanguagesMenu from "../LanguagesMenu";
import { Link } from "@tanstack/react-router";

function PublicHeaderMenu() {
    const { t } = useTranslation();
    return (
        <Header
            style={{
                position: "fixed",
                zIndex: 1,
                width: "100%",
                display: "flex",
                alignItems: "center",
            }}
        >
            <div
                style={{
                    color: "#fff",
                    fontSize: "1.5rem",
                    marginRight: "2rem",
                    display: "flex",
                    alignItems: "center",
                }}
            >
                <Link to="/" style={{ color: "white" }}>
                    <CarOutlined style={{ marginRight: "0.5rem" }} />
                    {t(translations.general.appName)}
                </Link>
            </div>
            <Menu theme="dark" mode="horizontal" defaultSelectedKeys={["home"]}>
                <Menu.Item key="about">
                    {t(translations.general.aboutUs)}
                </Menu.Item>
                <Menu.Item key="contact">
                    {t(translations.general.contact)}
                </Menu.Item>
                <Menu.Item key="languages">
                    <GlobalOutlined />
                    <Dropdown dropdownRender={() => <LanguagesMenu />}>
                        {t(translations.general.language)}
                    </Dropdown>
                </Menu.Item>
                <Menu.Item key="login">
                    <Link to="/Login">
                        {t(translations.authorization.login)}
                    </Link>
                </Menu.Item>
            </Menu>
        </Header>
    );
}

export default PublicHeaderMenu;
