import { CloseOutlined, SearchOutlined } from "@ant-design/icons";
import { Button, DatePicker, Space } from "antd";
import { FilterConfirmProps } from "antd/es/table/interface";
import dayjs from "dayjs";
import React from "react";
import { defaultFormat } from "../../config/constants";

interface Props {
    selectedKeys: React.Key[];
    confirm: (param?: FilterConfirmProps) => void;
    setSelectedKeys: (selectedKeys: React.Key[]) => void;
    clearFilters?: () => void;
}

const DatePickerFilter: React.FC<Props> = (
    props: Props
): React.ReactElement => {
    const { selectedKeys, setSelectedKeys, confirm, clearFilters } = props;

    return (
        <Space direction="vertical" style={{ padding: 8 }}>
            <DatePicker
                placeholder="Choose date"
                value={
                    selectedKeys[0] ? dayjs(selectedKeys[0].toString()) : null
                }
                onChange={(e) => setSelectedKeys(e ? [e.toString()] : [])}
                format={defaultFormat}
                style={{ width: "100%" }}
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

export default DatePickerFilter;
