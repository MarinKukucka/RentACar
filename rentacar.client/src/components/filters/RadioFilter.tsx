import { CloseOutlined, SearchOutlined } from "@ant-design/icons";
import { Button, Radio, Space } from "antd";
import { RadioChangeEvent } from "antd/es/radio";
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
}

const RadioFilter: React.FC<Props> = (props: Props): React.ReactElement => {
    const { t } = useTranslation();

    const { selectedKeys, setSelectedKeys, confirm, clearFilters, options } =
        props;

    return (
        <Space direction="vertical" style={{ padding: 8 }}>
            <Radio.Group
                onChange={(e: RadioChangeEvent) =>
                    setSelectedKeys([e.target.value])
                }
                value={selectedKeys[0]}
                className="vertical"
            >
                {options.map(
                    (o: Option): React.ReactElement => (
                        <Radio key={o.key} value={o.value}>
                            {`${o.label}`}
                        </Radio>
                    )
                )}
            </Radio.Group>
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

export default RadioFilter;
