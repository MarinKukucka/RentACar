/* eslint-disable @typescript-eslint/no-explicit-any */
import {
    ReservationDto,
    ReservationStatus,
    UpdateReservationCommand,
} from "../../api/api";
import * as v from "valibot";
import { DrawerSchema, DrawerStateType } from "../../models/search";
import { useCallback, useEffect, useState } from "react";
import { Route } from "../../routes/_authorizedRoutes/reservations/$id/$tab";
import { useTranslation } from "react-i18next";
import { useNavigate } from "@tanstack/react-router";
import { useUpdateReservationMutation } from "../../api/reservations/reservations";
import { DrawerState } from "../../models/enums";
import {
    Button,
    Col,
    DatePicker,
    Drawer,
    Form,
    Input,
    Modal,
    Row,
    Space,
} from "antd";
import { DeleteOutlined, EditOutlined } from "@ant-design/icons";
import translations from "../../config/localization/translations";
import {
    datePickerFormatProps,
    defaultDateTimeFormat,
} from "../../helpers/FormatHelper";
import { DRAWER_WIDTH } from "../../config/constants";
import RentalForm from "../rentals/RentalForm";

interface Props {
    reservation?: ReservationDto;
}

const ReservationFormFilters = v.intersect([
    DrawerSchema,
    v.object({
        reservationId: v.optional(v.number()),
    }),
]);

export type ReservationFormFilters = v.InferOutput<
    typeof ReservationFormFilters
>;

function ReservationDetails({ reservation }: Props) {
    const [isCancelModalOpen, setIsCancelModalOpen] = useState(false);
    const [reservationToCancel, setReservationToCancel] =
        useState<ReservationDto>();

    const search: ReservationFormFilters = Route.useSearch();

    const { t } = useTranslation();
    const navigate = useNavigate({ from: Route.fullPath });
    const [form] = Form.useForm();

    const { mutateAsync: updateReservation } = useUpdateReservationMutation();

    useEffect(() => {
        if (reservation) {
            for (const [key, value] of Object.entries(reservation)) {
                form.setFieldsValue({ [key]: value });
            }
        }
    }, [form, reservation]);

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

    const showCancelModal = useCallback((reservation?: ReservationDto) => {
        setIsCancelModalOpen(true);
        setReservationToCancel(reservation);
    }, []);

    const handleCancelConfirm = useCallback(async () => {
        if (reservationToCancel) {
            await updateReservation({
                id: reservationToCancel.id,
                status: ReservationStatus.Cancelled,
                cancelledAt: new Date(),
            } as UpdateReservationCommand);

            setIsCancelModalOpen(false);
            setReservationToCancel(undefined);
        }
    }, [reservationToCancel, updateReservation]);

    const handleCancelCancel = useCallback(() => {
        setIsCancelModalOpen(false);
        setReservationToCancel(undefined);
    }, []);

    // #endregion

    return (
        <>
            <Row>
                <Col span={3} offset={21}>
                    <Space style={{ float: "right", marginBottom: 15 }}>
                        {reservation?.status ===
                            ReservationStatus.Confirmed && (
                            <Button
                                icon={<EditOutlined />}
                                onClick={() =>
                                    handleDrawerMode(DrawerState.Edit)
                                }
                            >
                                {t(translations.rentals.createRental)}
                            </Button>
                        )}
                        {(reservation?.status === ReservationStatus.Pending ||
                            reservation?.status ===
                                ReservationStatus.Confirmed) && (
                            <Button
                                danger
                                icon={<DeleteOutlined />}
                                onClick={() => showCancelModal(reservation)}
                            >
                                {t(translations.reservations.cancelReservation)}
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
                            name="startDateTime"
                            label={t(translations.reservations.startDateTime)}
                            {...datePickerFormatProps}
                        >
                            <DatePicker
                                disabled
                                format={defaultDateTimeFormat}
                            />
                        </Form.Item>
                        <Form.Item
                            name="endDateTime"
                            label={t(translations.reservations.endDateTime)}
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
                                    reservation?.status
                                        ? ReservationStatus[reservation?.status]
                                        : undefined
                                }
                            />
                        </Form.Item>
                        <Form.Item
                            label={t(translations.reservations.totalPrice)}
                        >
                            <Input
                                readOnly
                                value={reservation?.totalPrice}
                                addonAfter="€"
                            />
                        </Form.Item>
                        <Form.Item label="Notes">
                            <Input readOnly value={reservation?.notes} />
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
                            label={t(translations.reservations.personName)}
                        >
                            <Input readOnly value={reservation?.personName} />
                        </Form.Item>
                        <Form.Item
                            label={t(translations.reservations.pickupLocation)}
                        >
                            <Input
                                readOnly
                                value={reservation?.pickupLocationName}
                            />
                        </Form.Item>
                        <Form.Item
                            label={t(translations.reservations.returnLocation)}
                        >
                            <Input
                                readOnly
                                value={reservation?.returnLocationName}
                            />
                        </Form.Item>
                        <Form.Item
                            label={t(translations.reservations.extraServices)}
                        >
                            {reservation?.extraServices?.map((x) => (
                                <div>{x}</div>
                            ))}
                        </Form.Item>
                    </Form>
                </Col>
            </Row>

            <Drawer
                title={t(translations.rentals.createRental)}
                open={!!search.drawerState}
                onClose={() => handleDrawerMode(DrawerState.Closed)}
                destroyOnClose
                width={DRAWER_WIDTH}
            >
                <RentalForm
                    onClose={() => handleDrawerMode(DrawerState.Closed)}
                    onSuccess={() => handleDrawerMode(DrawerState.Closed)}
                    reservationId={reservation?.id}
                />
            </Drawer>

            <Modal
                title={t(translations.reservations.confirmCancelReservation)}
                open={isCancelModalOpen}
                onOk={handleCancelConfirm}
                onCancel={handleCancelCancel}
                okText={t(translations.general.yes)}
                cancelText={t(translations.general.no)}
            />
        </>
    );
}

export default ReservationDetails;
