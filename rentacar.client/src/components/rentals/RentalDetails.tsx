/* eslint-disable @typescript-eslint/no-explicit-any */
import { RentalDto, RentalStatus } from "../../api/api";
import * as v from "valibot";
import { DrawerSchema, DrawerStateType } from "../../models/search";
import { ReservationFormFilters } from "../reservations/ReservationDetails";
import { Route } from "../../routes/_authorizedRoutes/rentals/$id/$tab";
import { useTranslation } from "react-i18next";
import { useNavigate } from "@tanstack/react-router";
import { Button, Col, DatePicker, Drawer, Form, Input, Row, Space } from "antd";
import { useCallback, useEffect } from "react";
import { DrawerState } from "../../models/enums";
import { EditOutlined } from "@ant-design/icons";
import translations from "../../config/localization/translations";
import {
    datePickerFormatProps,
    defaultDateTimeFormat,
} from "../../helpers/FormatHelper";
import FileLink from "../files/FileLink";
import { DRAWER_WIDTH } from "../../config/constants";
import RentalForm from "./RentalForm";

interface Props {
    rental?: RentalDto;
}

const RentalFormFilters = v.intersect([
    DrawerSchema,
    v.object({
        rentalId: v.optional(v.number()),
    }),
]);

export type RentalFormFilters = v.InferOutput<typeof RentalFormFilters>;

function RentalDetails({ rental }: Props) {
    const search: ReservationFormFilters = Route.useSearch();

    const { t } = useTranslation();
    const navigate = useNavigate({ from: Route.fullPath });
    const [form] = Form.useForm();

    useEffect(() => {
        if (rental) {
            for (const [key, value] of Object.entries(rental)) {
                form.setFieldsValue({ [key]: value });
            }
        }
    }, [form, rental]);

    // #region Callbacks

    const updateFilters = useCallback(
        (name: keyof DrawerStateType, value: unknown) => {
            navigate({ search: (prev: any) => ({ ...prev, [name]: value }) });
        },
        [navigate]
    );

    const handleDrawerMode = useCallback(
        (drawerState: DrawerState) => {
            updateFilters(
                "drawerState",
                drawerState !== DrawerState.Closed ? drawerState : undefined
            );
        },
        [updateFilters]
    );

    // #endregion

    return (
        <>
            <Row>
                <Col span={3} offset={21}>
                    <Space style={{ float: "right", marginBottom: 15 }}>
                        {rental?.status !== RentalStatus.Returned && (
                            <Button
                                icon={<EditOutlined />}
                                onClick={() =>
                                    handleDrawerMode(DrawerState.Edit)
                                }
                            >
                                {t(translations.rentals.finishRental)}
                            </Button>
                        )}
                    </Space>
                </Col>
                <Col span={12}>
                    <Form
                        form={form}
                        size="small"
                        labelCol={{ span: 7 }}
                        wrapperCol={{ span: 17 }}
                    >
                        <Form.Item
                            name="pickupDateTime"
                            label={t(translations.rentals.pickupDateTime)}
                            {...datePickerFormatProps}
                        >
                            <DatePicker
                                disabled
                                format={defaultDateTimeFormat}
                            />
                        </Form.Item>
                        <Form.Item
                            name="returnDateTime"
                            label={t(translations.rentals.returnDateTime)}
                            {...datePickerFormatProps}
                        >
                            <DatePicker
                                disabled
                                format={defaultDateTimeFormat}
                            />
                        </Form.Item>
                        <Form.Item label={t(translations.reservations.status)}>
                            <Input
                                readOnly
                                value={
                                    rental?.status
                                        ? RentalStatus[rental?.status]
                                        : undefined
                                }
                            />
                        </Form.Item>
                        <Form.Item
                            label={t(translations.reservations.totalPrice)}
                        >
                            <Input
                                readOnly
                                value={rental?.totalPrice}
                                addonAfter="€"
                            />
                        </Form.Item>
                        <Form.Item label={t(translations.rentals.notes)}>
                            <Input.TextArea
                                rows={5}
                                style={{ resize: "none" }}
                                readOnly
                                value={rental?.notes}
                            />
                        </Form.Item>
                    </Form>
                </Col>
                <Col span={12}>
                    <Form
                        size="small"
                        labelCol={{ span: 7 }}
                        wrapperCol={{ span: 17 }}
                    >
                        <Form.Item
                            label={t(translations.rentals.odometerStart)}
                        >
                            <Input readOnly value={rental?.odometerStart} />
                        </Form.Item>
                        <Form.Item label={t(translations.rentals.odometerEnd)}>
                            <Input readOnly value={rental?.odometerEnd} />
                        </Form.Item>
                        <Form.Item label={t(translations.rentals.photos)}>
                            {rental?.files?.map((record) => (
                                <div>
                                    <FileLink
                                        fileName={record.name}
                                        filePath={record.path}
                                    />
                                </div>
                            ))}
                        </Form.Item>
                    </Form>
                </Col>
            </Row>

            <Drawer
                title={t(translations.rentals.finishRental)}
                open={!!search.drawerState}
                onClose={() => handleDrawerMode(DrawerState.Closed)}
                destroyOnClose
                width={DRAWER_WIDTH}
            >
                <RentalForm
                    onClose={() => handleDrawerMode(DrawerState.Closed)}
                    onSuccess={() => handleDrawerMode(DrawerState.Closed)}
                    reservationId={rental?.id}
                />
            </Drawer>
        </>
    );
}

export default RentalDetails;
