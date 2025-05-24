import { CloseOutlined, SearchOutlined } from "@ant-design/icons";
import { Button, Input, Space } from "antd";
import { FilterConfirmProps } from "antd/es/table/interface";
import React from "react";
import { useTranslation } from "react-i18next";
import translations from "../../config/localization/translations";

interface Props {
    selectedKeys: React.Key[];
    confirm: (param?: FilterConfirmProps) => void;
    setSelectedKeys: (selectedKeys: React.Key[]) => void;
    clearFilters?: () => void;
}

const SearchFilter: React.FC<Props> = (props: Props): React.ReactElement => {
    const { t } = useTranslation();

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

export default SearchFilter;
