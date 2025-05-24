/* eslint-disable @typescript-eslint/no-explicit-any */
import { CloseOutlined, SearchOutlined } from "@ant-design/icons";
import { Select, Button, Space } from "antd";
import { FilterConfirmProps } from "antd/es/table/interface";
import React from "react";
import { Option } from "../../models/options";
import { useTranslation } from "react-i18next";
import translations from "../../config/localization/translations";

interface Props {
    selectedKeys: React.Key[];
    confirm: (param?: FilterConfirmProps) => void;
    setSelectedKeys: (selectedKeys: React.Key[]) => void;
    clearFilters?: () => void;
    options: Option[];
    multiple?: boolean;
}

const SelectFilter: React.FC<Props> = (props: Props): React.ReactElement => {
    const { t } = useTranslation();

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
                    {t(translations.general.search)}
                </Button>
                <Button
                    onClick={() => (clearFilters ? clearFilters() : undefined)}
                    icon={<CloseOutlined />}
                    size="small"
                >
                    {t(translations.general.clear)}
                </Button>
                <Button
                    type="link"
                    size="small"
                    onClick={() => {
                        confirm({ closeDropdown: false });
                    }}
                >
                    {t(translations.general.filter)}
                </Button>
            </Space>
        </Space>
    );
};

export default SelectFilter;
