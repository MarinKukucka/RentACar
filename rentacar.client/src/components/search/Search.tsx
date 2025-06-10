import { Button, Card, DatePicker, Form, Select } from "antd";
import { useTranslation } from "react-i18next";
import translations from "../../config/localization/translations";
import {
    datePickerFormatProps,
    defaultDateFormat,
} from "../../helpers/FormatHelper";
import { useCallback, useState } from "react";
import * as v from "valibot";
import { useNavigate } from "@tanstack/react-router";
import { useFetchLocationOptions } from "../../api/locations/locations";
import { CloseOutlined, PlusOutlined } from "@ant-design/icons";

const SearchFilter = v.object({
    pickupLocationId: v.optional(v.number()),
    returnLocationId: v.optional(v.number()),
    pickupDate: v.optional(v.date()),
    dropOffDate: v.optional(v.date()),
    vehicleId: v.optional(v.number()),
});

export type SearchFilter = v.InferOutput<typeof SearchFilter>;

interface Props {
    resultSearch?: boolean;
    onClose?: () => void;
    searchFilter?: SearchFilter;
}

function Search({ resultSearch, onClose, searchFilter }: Props) {
    const [isReturnLocationSame, setIsReturnlocationSame] =
        useState<boolean>(true);

    const { t } = useTranslation();
    const navigate = useNavigate();

    const { data: locationOptions } = useFetchLocationOptions();

    const handleSubmitSearch = useCallback(
        (values: {
            pickupLocationId: number;
            returnLocationId: number;
            pickupDate: Date;
            dropOffDate: Date;
        }) => {
            const {
                pickupLocationId,
                returnLocationId,
                pickupDate,
                dropOffDate,
            } = values;

            navigate({
                to: "/SearchResults",
                search: {
                    pickupLocationId,
                    returnLocationId: isReturnLocationSame
                        ? pickupLocationId
                        : returnLocationId,
                    pickupDate,
                    dropOffDate,
                },
            });

            if (onClose) onClose();
        },
        [isReturnLocationSame, navigate, onClose]
    );

    const verticalFormItemStyle = {
        display: "flex",
        flexDirection: "column" as const,
        alignItems: "flex-start",
        marginRight: 16,
        minWidth: 200,
    };

    const labelStyle = {
        marginBottom: 4,
        fontSize: 12,
        fontWeight: 500,
        color: "#595959",
    };

    return (
        <Card
            style={{
                marginBottom: 50,
                padding: 24,
                boxShadow: "0 2px 8px rgba(0,0,0,0.1)",
                borderRadius: 12,
            }}
        >
            <Form
                layout="inline"
                onFinish={handleSubmitSearch}
                initialValues={searchFilter}
                style={{
                    display: "flex",
                    flexWrap: "wrap",
                    justifyContent: "center",
                    alignItems: "flex-start",
                    gap: 16,
                }}
            >
                {resultSearch && (
                    <CloseOutlined
                        style={{
                            fontSize: 20,
                            marginRight: 16,
                            cursor: "pointer",
                            alignSelf: "flex-start",
                        }}
                        onClick={onClose}
                    />
                )}

                <div style={verticalFormItemStyle}>
                    <label style={labelStyle}>
                        {t(translations.vehicles.pickupLocation)}
                    </label>
                    <Form.Item
                        name="pickupLocationId"
                        rules={[{ required: true, message: "Required" }]}
                        style={{ marginBottom: 0 }}
                    >
                        <Select<number>
                            placeholder={t(
                                translations.vehicles.chooseLocationPlaceholder
                            )}
                            options={locationOptions}
                            size="large"
                            style={{ minWidth: 200 }}
                        />
                    </Form.Item>
                </div>

                {isReturnLocationSame ? (
                    <div style={verticalFormItemStyle}>
                        <label style={labelStyle}>&nbsp;</label>
                        <Button
                            onClick={() => setIsReturnlocationSame(false)}
                            icon={<PlusOutlined />}
                            size="large"
                            style={{ minWidth: 200 }}
                        >
                            {t(translations.vehicles.differentReturnLocation)}
                        </Button>
                    </div>
                ) : (
                    <div style={verticalFormItemStyle}>
                        <label style={labelStyle}>
                            {t(translations.vehicles.returnLocation)}
                        </label>
                        <Form.Item
                            name="returnLocationId"
                            rules={[{ required: true, message: "Required" }]}
                            style={{ marginBottom: 0 }}
                        >
                            <Select<number>
                                placeholder={t(
                                    translations.vehicles
                                        .chooseLocationPlaceholder
                                )}
                                options={locationOptions}
                                size="large"
                                style={{ minWidth: 200 }}
                            />
                        </Form.Item>
                    </div>
                )}

                <div style={verticalFormItemStyle}>
                    <label style={labelStyle}>
                        {t(translations.vehicles.pickupDate)}
                    </label>
                    <Form.Item
                        name="pickupDate"
                        rules={[{ required: true, message: "Required" }]}
                        {...datePickerFormatProps}
                        style={{ marginBottom: 0 }}
                    >
                        <DatePicker
                            format={defaultDateFormat}
                            size="large"
                            style={{ minWidth: 180 }}
                        />
                    </Form.Item>
                </div>

                <div style={verticalFormItemStyle}>
                    <label style={labelStyle}>
                        {t(translations.vehicles.dropOffDate)}
                    </label>
                    <Form.Item
                        name="dropOffDate"
                        rules={[{ required: true, message: "Required" }]}
                        {...datePickerFormatProps}
                        style={{ marginBottom: 0 }}
                    >
                        <DatePicker
                            format={defaultDateFormat}
                            size="large"
                            style={{ minWidth: 180 }}
                        />
                    </Form.Item>
                </div>

                <div style={{ alignSelf: "flex-end" }}>
                    <Form.Item style={{ marginBottom: 0 }}>
                        <Button type="primary" htmlType="submit" size="large">
                            {t(translations.general.search)}
                        </Button>
                    </Form.Item>
                </div>
            </Form>
        </Card>
    );
}

export default Search;
