import React from "react";
import { Layout as AntLayout } from "antd";
import PublicHeaderMenu from "./PublicHeaderMenu";
import { Footer } from "antd/es/layout/layout";

interface Props {
    children?: React.ReactNode;
}

function PublicLayout({ children }: Props) {
    return (
        <AntLayout style={{ minHeight: "100vh" }}>
            <AntLayout.Content style={{ padding: 0 }}>
                <PublicHeaderMenu />
                {children}
            </AntLayout.Content>
            <Footer style={{ textAlign: "center", background: "#fff" }}>
                Rent A Car CARcarAPP ©2025 Created by Marin Kukučka
            </Footer>
        </AntLayout>
    );
}

export default PublicLayout;
