/* eslint-disable @typescript-eslint/no-explicit-any */
import { useTranslation } from "react-i18next";
import { DrawerSchema, SearchSortPaginationSchema } from "../../models/search";
import * as v from "valibot";
import { Route } from "../../routes/_authorizedRoutes/rentals";
import { useNavigate } from "@tanstack/react-router";
import { useFetchPaginatedRentalsQuery } from "../../api/rentals/rentals";
import { useCallback, useState } from "react";
import { Button, Drawer, Table, TablePaginationConfig } from "antd";
import { FilterValue, SorterResult } from "antd/es/table/interface";
import { FileDto, RentalDto, RentalStatus } from "../../api/api";
import { TableParamsChange } from "../../helpers/SearchHelper";
import translations from "../../config/localization/translations";
import { getCheckboxFilter, getSearchFilter } from "../../helpers/FilterHelper";
import { PageHeader } from "@ant-design/pro-layout";
import { defaultTablePagination, DRAWER_WIDTH } from "../../config/constants";
import { getRentalStatusOptions } from "../../helpers/OptionsMappingHelper";
import { formatDateTime } from "../../helpers/FormatHelper";
import { DrawerState } from "../../models/enums";
import RentalForm from "./RentalForm";
import FileLink from "../files/FileLink";

const RentalsFilters = v.intersect([
    SearchSortPaginationSchema,
    DrawerSchema,
    v.object({
        id: v.optional(v.number()),
        status: v.optional(v.number()),
    }),
]);

export type RentalsFilters = v.InferOutput<typeof RentalsFilters>;

function Rentals() {
    const [selectedRentalId, setSelectedRentalId] = useState<number>();

    const { t } = useTranslation();
    const search: RentalsFilters = Route.useSearch();
    const navigate = useNavigate({ from: Route.fullPath });

    const { data: rentals, isLoading } = useFetchPaginatedRentalsQuery(search);

    const rentalStatusOptions = getRentalStatusOptions();

    // #region Callbacks

    const updateFilters = useCallback(
        (name: keyof RentalsFilters, value: unknown) => {
            navigate({ search: (prev: any) => ({ ...prev, [name]: value }) });
        },
        [navigate]
    );

    const handleTableChange = useCallback(
        (
            pagination: TablePaginationConfig,
            filters: Record<string, FilterValue | null>,
            sorter: SorterResult<RentalDto> | SorterResult<RentalDto>[],
            { action }: { action: "paginate" | "sort" | "filter" }
        ) => {
            TableParamsChange<RentalDto>(
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
        (drawerState: DrawerState, rentalId?: number) => {
            updateFilters(
                "drawerState",
                drawerState !== DrawerState.Closed ? drawerState : undefined
            );
            setSelectedRentalId(rentalId);
        },
        [updateFilters]
    );

    // #endregion

    const columns = [
        {
            title: t(translations.rentals.identificator),
            dataIndex: "id",
            ...getSearchFilter(),
            filteredValue: search.id !== undefined ? [search.id] : null,
        },
        {
            title: t(translations.rentals.status),
            dataIndex: "status",
            ...getCheckboxFilter(rentalStatusOptions),
            filteredValue: search.status !== undefined ? [search.status] : null,
            sorter: true,
            render: (value: number) => RentalStatus[value],
        },
        {
            title: t(translations.rentals.pickupDateTime),
            dataIndex: "pickupDateTime",
            sorter: true,
            render: (value: Date) => formatDateTime(value),
        },
        {
            title: t(translations.rentals.returnDateTime),
            dataIndex: "returnDateTime",
            sorter: true,
            render: (value: Date) => formatDateTime(value),
        },
        {
            title: t(translations.rentals.odometerStart),
            dataIndex: "odometerStart",
            sorter: true,
            render: (value: number) => <div>{value} km</div>,
        },
        {
            title: t(translations.rentals.odometerEnd),
            dataIndex: "odometerEnd",
            sorter: true,
            render: (value: number) => value && <div>{value} km</div>,
        },
        {
            title: t(translations.rentals.totalPrice),
            dataIndex: "totalPrice",
            sorter: true,
        },
        {
            title: t(translations.rentals.photos),
            dataIndex: "files",
            render: (records: FileDto[]) =>
                records.map((record) => (
                    <div>
                        <FileLink
                            fileName={record.name}
                            filePath={record.path}
                        />
                    </div>
                )),
        },
        {
            title: t(translations.rentals.notes),
            dataIndex: "notes",
            sorter: true,
        },
        {
            title: t(translations.general.actions),
            key: "actions",
            render: (record: RentalDto) => {
                return (
                    record.status !== RentalStatus.Returned && (
                        <Button
                            type="primary"
                            onClick={() =>
                                handleDrawerMode(DrawerState.Edit, record.id)
                            }
                        >
                            {t(translations.rentals.finishRental)}
                        </Button>
                    )
                );
            },
        },
    ];

    return (
        <>
            <PageHeader title={t(translations.rentals.title)} />

            <Table
                columns={columns}
                dataSource={rentals?.items}
                rowKey={(rental: RentalDto): string => rental.id?.toString()}
                loading={isLoading}
                pagination={{
                    ...defaultTablePagination,
                    current: search.currentPage,
                    pageSize: search.pageSize,
                    total: rentals?.totalItems,
                }}
                onChange={handleTableChange}
                bordered
            />

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
                    rentalId={selectedRentalId}
                />
            </Drawer>
        </>
    );
}

export default Rentals;
