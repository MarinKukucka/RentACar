import { Button, Card, DatePicker, Form, Select } from "antd";
import { useTranslation } from "react-i18next";
import translations from "../../config/localization/translations";
import {
    datePickerFormatProps,
    defaultDateFormat,
} from "../../helpers/FormatHelper";
import { useCallback } from "react";
import * as v from "valibot";
import { useNavigate } from "@tanstack/react-router";
import { useFetchLocationOptions } from "../../api/locations/locations";
import { CloseOutlined } from "@ant-design/icons";

const SearchFilter = v.object({
    pickupLocationId: v.optional(v.number()),
    pickupDate: v.optional(v.date()),
    dropOffDate: v.optional(v.date()),
});

export type SearchFilter = v.InferOutput<typeof SearchFilter>;

interface Props {
    resultSearch?: boolean;
    onClose?: () => void;
    searchFilter?: SearchFilter;
}

function Search({ resultSearch, onClose, searchFilter }: Props) {
    const { t } = useTranslation();
    const navigate = useNavigate();

    const { data: locationOptions } = useFetchLocationOptions();

    // #region Callbacks

    const handleSubmitSearch = useCallback(
        (values: {
            pickupLocationId: number;
            pickupDate: Date;
            dropOffDate: Date;
        }) => {
            const { pickupLocationId, pickupDate, dropOffDate } = values;

            navigate({
                to: "/SearchResults",
                search: {
                    pickupLocationId: pickupLocationId,
                    pickupDate: pickupDate,
                    dropOffDate: dropOffDate,
                },
            });

            if (onClose) onClose();
        },
        [navigate, onClose]
    );

    // #endregion

    return (
        <Card style={{ marginBottom: "50px" }}>
            <Form
                layout="inline"
                onFinish={handleSubmitSearch}
                style={{ width: "100%", justifyContent: "center" }}
                initialValues={searchFilter}
            >
                {resultSearch && (
                    <CloseOutlined
                        style={{ marginRight: 20 }}
                        onClick={onClose}
                    />
                )}
                <Form.Item
                    name="pickupLocationId"
                    rules={[
                        {
                            required: true,
                        },
                    ]}
                >
                    <Select<number>
                        placeholder={t(
                            translations.vehicles.chooseLocationPlaceholder
                        )}
                        options={locationOptions}
                    />
                </Form.Item>
                <Form.Item
                    name="pickupDate"
                    rules={[
                        {
                            required: true,
                        },
                    ]}
                    {...datePickerFormatProps}
                >
                    <DatePicker format={defaultDateFormat} />
                </Form.Item>
                <Form.Item
                    name="dropOffDate"
                    rules={[
                        {
                            required: true,
                        },
                    ]}
                    {...datePickerFormatProps}
                >
                    <DatePicker format={defaultDateFormat} />
                </Form.Item>
                <Form.Item>
                    <Button type="primary" htmlType="submit">
                        {t(translations.general.search)}
                    </Button>
                </Form.Item>
            </Form>
        </Card>
    );
}

export default Search;
