/* eslint-disable @typescript-eslint/no-explicit-any */
import { useTranslation } from "react-i18next";
import { DrawerSchema, SearchSortPaginationSchema } from "../../models/search";
import * as v from "valibot";
import { Route } from "../../routes/_authorizedRoutes/reservations/index";
import { useNavigate } from "@tanstack/react-router";
import {
    useFetchPaginatedReservationsQuery,
    useUpdateReservationMutation,
} from "../../api/reservations/reservations";
import { useCallback, useState } from "react";
import {
    Button,
    Drawer,
    Dropdown,
    Modal,
    Table,
    TablePaginationConfig,
} from "antd";
import { FilterValue, SorterResult } from "antd/es/table/interface";
import {
    FileDto,
    ReservationDto,
    ReservationStatus,
    UpdateReservationCommand,
} from "../../api/api";
import { TableParamsChange } from "../../helpers/SearchHelper";
import translations from "../../config/localization/translations";
import { getCheckboxFilter, getSearchFilter } from "../../helpers/FilterHelper";
import { PageHeader } from "@ant-design/pro-layout";
import { defaultTablePagination, DRAWER_WIDTH } from "../../config/constants";
import { formatDate } from "../../helpers/FormatHelper";
import { getReservationStatusOptions } from "../../helpers/OptionsMappingHelper";
import { DrawerState } from "../../models/enums";
import RentalForm from "../rentals/RentalForm";
import { EllipsisOutlined } from "@ant-design/icons";
import FileLink from "../files/FileLink";

const ReservationsFilter = v.intersect([
    SearchSortPaginationSchema,
    DrawerSchema,
    v.object({
        id: v.optional(v.number()),
        startDateTime: v.optional(v.date()),
        endDateTime: v.optional(v.date()),
        status: v.optional(v.number()),
    }),
]);

export type ReservationsFilter = v.InferOutput<typeof ReservationsFilter>;

function Reservations() {
    const [selectedReservationId, setSelectedReservationId] =
        useState<number>();
    const [isCancelModalOpen, setIsCancelModalOpen] = useState(false);
    const [reservationToCancel, setReservationToCancel] =
        useState<ReservationDto>();

    const { t } = useTranslation();
    const search: ReservationsFilter = Route.useSearch();
    const navigate = useNavigate({ from: Route.fullPath });

    const { data: reservations, isLoading } =
        useFetchPaginatedReservationsQuery(search);

    const { mutateAsync: updateReservation } = useUpdateReservationMutation();

    const reservationStatusOption = getReservationStatusOptions();

    // #region Callbacks

    const updateFilters = useCallback(
        (name: keyof ReservationsFilter, value: unknown) => {
            navigate({ search: (prev: any) => ({ ...prev, [name]: value }) });
        },
        [navigate]
    );

    const handleTableChange = useCallback(
        (
            pagination: TablePaginationConfig,
            filters: Record<string, FilterValue | null>,
            sorter:
                | SorterResult<ReservationDto>
                | SorterResult<ReservationDto>[],
            { action }: { action: "paginate" | "sort" | "filter" }
        ) => {
            TableParamsChange<ReservationDto>(
                pagination,
                filters,
                sorter,
                action,
                updateFilters
            );
        },
        [updateFilters]
    );

    const handleDrawerMode = useCallback(
        (drawerState: DrawerState, reservationId?: number) => {
            updateFilters(
                "drawerState",
                drawerState !== DrawerState.Closed ? drawerState : undefined
            );
            setSelectedReservationId(reservationId);
        },
        [updateFilters]
    );

    const showCancelModal = useCallback((reservation: ReservationDto) => {
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

    const columns = [
        {
            title: t(translations.reservations.identificator),
            dataIndex: "id",
            ...getSearchFilter(),
            filteredValue: search.id !== undefined ? [search.id] : null,
        },
        {
            title: t(translations.reservations.startDateTime),
            dataIndex: "startDateTime",
            sorter: true,
            render: (value: Date) => formatDate(value),
        },
        {
            title: t(translations.reservations.endDateTime),
            dataIndex: "endDateTime",
            sorter: true,
            render: (value: Date) => formatDate(value),
        },
        {
            title: t(translations.reservations.status),
            dataIndex: "status",
            ...getCheckboxFilter(reservationStatusOption),
            filteredValue: search.status !== undefined ? [search.status] : null,
            sorter: true,
            render: (value: number) => ReservationStatus[value],
        },
        {
            title: t(translations.reservations.totalPrice),
            dataIndex: "totalPrice",
            sorter: true,
            render: (value: number) => <p>{value} €</p>,
        },
        {
            title: t(translations.reservations.personName),
            dataIndex: "personName",
            sorter: true,
        },
        {
            title: t(translations.reservations.pickupLocation),
            dataIndex: "pickupLocationName",
        },
        {
            title: t(translations.reservations.returnLocation),
            dataIndex: "returnLocationName",
        },
        {
            title: t(translations.reservations.extraServices),
            dataIndex: "extraServices",
            sorter: true,
            render: (values: string[]) => {
                return values.map((val) => <div>{val}</div>);
            },
        },
        {
            title: t(translations.reservations.invoice),
            dataIndex: "invoice",
            render: (record?: FileDto) =>
                record && (
                    <div>
                        <FileLink
                            fileName={record.name}
                            filePath={record.path}
                        />
                    </div>
                ),
        },
        {
            title: t(translations.general.actions),
            key: "actions",
            render: (record: ReservationDto) => {
                const menutItems = [
                    {
                        key: "create",
                        label: (
                            <Button
                                type="text"
                                onClick={() =>
                                    handleDrawerMode(
                                        DrawerState.Create,
                                        record.id
                                    )
                                }
                            >
                                {t(translations.rentals.createRental)}
                            </Button>
                        ),
                    },
                    {
                        key: "cancel",
                        label: (
                            <Button
                                type="text"
                                danger
                                onClick={() => showCancelModal(record)}
                            >
                                {t(translations.rentals.cancelRental)}
                            </Button>
                        ),
                    },
                ];

                return (
                    <div onClick={(event) => event.stopPropagation()}>
                        <Dropdown
                            menu={{ items: menutItems }}
                            trigger={["hover"]}
                        >
                            <Button icon={<EllipsisOutlined />} />
                        </Dropdown>
                    </div>
                );
            },
        },
    ];

    return (
        <>
            <PageHeader title={t(translations.reservations.title)} />

            <Table
                columns={columns}
                dataSource={reservations?.items}
                rowKey={(reservation: ReservationDto): string =>
                    reservation.id?.toString()
                }
                loading={isLoading}
                pagination={{
                    ...defaultTablePagination,
                    current: search.currentPage,
                    pageSize: search.pageSize,
                    total: reservations?.totalItems,
                }}
                onChange={handleTableChange}
                bordered
            />

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
                    reservationId={selectedReservationId}
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

export default Reservations;
