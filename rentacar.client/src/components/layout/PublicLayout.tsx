import React from "react";
import { Layout as AntLayout } from "antd";

interface Props {
    children?: React.ReactNode;
}

function PublicLayout({ children }: Props) {
    return (
        <AntLayout style={{ minHeight: "100vh" }}>
            <AntLayout.Content style={{ padding: 0 }}>
                {children}
            </AntLayout.Content>
        </AntLayout>
    );
}

export default PublicLayout;
