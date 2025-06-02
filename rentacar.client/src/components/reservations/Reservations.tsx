/* eslint-disable @typescript-eslint/no-explicit-any */
import { useTranslation } from "react-i18next";
import { SearchSortPaginationSchema } from "../../models/search";
import * as v from "valibot";
import { Route } from "../../routes/_authorizedRoutes/reservations/index";
import { useNavigate } from "@tanstack/react-router";
import { useFetchPaginatedReservationsQuery } from "../../api/reservations/reservations";
import { useCallback } from "react";
import { Table, TablePaginationConfig } from "antd";
import { FilterValue, SorterResult } from "antd/es/table/interface";
import { ReservationDto, ReservationStatus } from "../../api/api";
import { TableParamsChange } from "../../helpers/SearchHelper";
import translations from "../../config/localization/translations";
import { getCheckboxFilter, getSearchFilter } from "../../helpers/FilterHelper";
import { PageHeader } from "@ant-design/pro-layout";
import { defaultTablePagination } from "../../config/constants";
import { formatDate } from "../../helpers/FormatHelper";
import { getReservationStatusOptions } from "../../helpers/OptionsMappingHelper";

const ReservationsFilter = v.intersect([
    SearchSortPaginationSchema,
    v.object({
        id: v.optional(v.number()),
        startDateTime: v.optional(v.date()),
        endDateTime: v.optional(v.date()),
        status: v.optional(v.number()),
    }),
]);

export type ReservationsFilter = v.InferOutput<typeof ReservationsFilter>;

function Reservations() {
    const { t } = useTranslation();
    const search: ReservationsFilter = Route.useSearch();
    const navigate = useNavigate({ from: Route.fullPath });

    const { data: reservations, isLoading } =
        useFetchPaginatedReservationsQuery(search);

    const reservationStatusOption = getReservationStatusOptions();

    // #region Callbacks

    const updateFilters = useCallback(
        (name: keyof ReservationDto, value: unknown) => {
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
        },
        {
            title: t(translations.reservations.personName),
            dataIndex: "personName",
            sorter: true,
        },
        {
            title: t(translations.reservations.extraServices),
            dataIndex: "extraServices",
            sorter: true,
            render: (values: string[]) => {
                return values.map((val) => <div>{val}</div>);
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
        </>
    );
}

export default Reservations;
