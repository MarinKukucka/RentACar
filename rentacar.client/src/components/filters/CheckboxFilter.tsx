/* eslint-disable @typescript-eslint/no-explicit-any */
import { CloseOutlined, SearchOutlined } from "@ant-design/icons";
import { Button, Space, Checkbox } from "antd";
import { FilterConfirmProps } from "antd/es/table/interface";
import React from "react";
import { Option } from "../../models/options";
import { CheckboxOptionType } from "antd";

interface Props {
    selectedKeys: React.Key[];
    confirm: (param?: FilterConfirmProps) => void;
    setSelectedKeys: (selectedKeys: React.Key[]) => void;
    clearFilters?: () => void;
    options: Option[];
}

const CheckboxFilter: React.FC<Props> = (props: Props): React.ReactElement => {
    const { selectedKeys, setSelectedKeys, confirm, clearFilters, options } =
        props;

    return (
        <Space direction="vertical" style={{ padding: 8 }}>
            <Checkbox.Group
                value={selectedKeys}
                onChange={(values: any) => setSelectedKeys(values)}
                options={options as CheckboxOptionType[]}
                className="vertical"
            />

            <Space>
                <Button
                    type="primary"
                    onClick={() => confirm()}
                    icon={<SearchOutlined />}
                    size="small"
                >
                    Search
                </Button>
                <Button
                    onClick={() => (clearFilters ? clearFilters() : undefined)}
                    icon={<CloseOutlined />}
                    size="small"
                >
                    Clear
                </Button>
                <Button
                    type="link"
                    size="small"
                    onClick={() => {
                        confirm({ closeDropdown: false });
                    }}
                >
                    Filter
                </Button>
            </Space>
        </Space>
    );
};

export default CheckboxFilter;
