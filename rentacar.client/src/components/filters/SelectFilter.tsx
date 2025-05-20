/* eslint-disable @typescript-eslint/no-explicit-any */
import { CloseOutlined, SearchOutlined } from "@ant-design/icons";
import { Select, Button, Space } from "antd";
import { FilterConfirmProps } from "antd/es/table/interface";
import React from "react";
import { Option } from "../../models/options";

interface Props {
    selectedKeys: React.Key[];
    confirm: (param?: FilterConfirmProps) => void;
    setSelectedKeys: (selectedKeys: React.Key[]) => void;
    clearFilters?: () => void;
    options: Option[];
    multiple?: boolean;
}

const SelectFilter: React.FC<Props> = (props: Props): React.ReactElement => {
    const {
        selectedKeys,
        setSelectedKeys,
        confirm,
        clearFilters,
        options,
        multiple,
    } = props;

    return (
        <Space direction="vertical" style={{ padding: 8 }}>
            <Select
                showSearch
                placeholder="Choose"
                mode={multiple ? "tags" : undefined}
                value={selectedKeys}
                onChange={(values: any) => setSelectedKeys(values)}
                style={{ width: "100%" }}
            >
                {options.map(
                    (o: Option): React.ReactElement => (
                        <Select.Option key={o.key} value={o.value}>
                            {`${o.label}`}
                        </Select.Option>
                    )
                )}
            </Select>
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

export default SelectFilter;
