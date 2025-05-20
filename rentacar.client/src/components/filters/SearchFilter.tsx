import { CloseOutlined, SearchOutlined } from "@ant-design/icons";
import { Button, Input, Space } from "antd";
import { FilterConfirmProps } from "antd/es/table/interface";
import React from "react";

interface Props {
    selectedKeys: React.Key[];
    confirm: (param?: FilterConfirmProps) => void;
    setSelectedKeys: (selectedKeys: React.Key[]) => void;
    clearFilters?: () => void;
}

const SearchFilter: React.FC<Props> = (props: Props): React.ReactElement => {
    const { selectedKeys, setSelectedKeys, confirm, clearFilters } = props;

    return (
        <Space direction="vertical" style={{ padding: 8 }}>
            <Input
                placeholder="Search"
                value={selectedKeys[0]}
                onChange={(e) =>
                    setSelectedKeys(e.target.value ? [e.target.value] : [])
                }
                onPressEnter={() => confirm()}
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

export default SearchFilter;
