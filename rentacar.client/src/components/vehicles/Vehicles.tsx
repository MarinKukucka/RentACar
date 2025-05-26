/* eslint-disable @typescript-eslint/no-explicit-any */
import { useNavigate } from "@tanstack/react-router";
import * as v from "valibot";
import { useCallback, useEffect, useState } from "react";
import {
    Button,
    Drawer,
    Dropdown,
    Modal,
    Table,
    TablePaginationConfig,
} from "antd";
import { FilterValue, SorterResult } from "antd/es/table/interface";
import { EllipsisOutlined, PlusOutlined } from "@ant-design/icons";
import { PageHeader } from "@ant-design/pro-layout";
import { DrawerSchema, SearchSortPaginationSchema } from "../../models/search";
import { FuelType, Transmission, VehicleDto, VehicleType } from "../../api/api";
import { TableParamsChange } from "../../helpers/SearchHelper";
import { DrawerState } from "../../models/enums";
import { getSearchFilter } from "../../helpers/FilterHelper";
import { defaultTablePagination, DRAWER_WIDTH } from "../../config/constants";
import VehiclesForm from "./VehiclesForm";
import {
    useDeleteVehicleMutation,
    useFetchPaginatedVehiclesQuery,
} from "../../api/vehicles/vehicles";
import { Route } from "../../routes/_authorizedRoutes/vehicles/index";
import { useTranslation } from "react-i18next";
import translations from "../../config/localization/translations";

const VehiclesFilter = v.intersect([
    SearchSortPaginationSchema,
    DrawerSchema,
    v.object({
        vin: v.optional(v.string()),
        licensePlate: v.optional(v.string()),
        year: v.optional(v.number()),
        mileage: v.optional(v.number()),
        vehicleType: v.optional(v.number()),
        transmission: v.optional(v.number()),
        fuelType: v.optional(v.number()),
        price: v.optional(v.number()),
        selectedVehicleId: v.optional(v.number()),
    }),
]);

export type VehiclesFilter = v.InferOutput<typeof VehiclesFilter>;

function Vehicles() {
    const [selectedVehicle, setSelectedVehicle] = useState<VehicleDto>();
    const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
    const [vehicleToDelete, setVehicleToDelete] = useState<VehicleDto>();

    const { t } = useTranslation();
    const search: VehiclesFilter = Route.useSearch();
    const navigate = useNavigate({ from: Route.fullPath });

    const { data: vehicles, isLoading } =
        useFetchPaginatedVehiclesQuery(search);

    const { mutateAsync: deleteVehicle } = useDeleteVehicleMutation();

    // #region Callbacks

    const updateFilters = useCallback(
        (name: keyof VehiclesFilter, value: unknown) => {
            navigate({ search: (prev: any) => ({ ...prev, [name]: value }) });
        },
        [navigate]
    );

    const handleTableChange = useCallback(
        (
            pagination: TablePaginationConfig,
            filters: Record<string, FilterValue | null>,
            sorter: SorterResult<VehicleDto> | SorterResult<VehicleDto>[],
            { action }: { action: "paginate" | "sort" | "filter" }
        ) => {
            TableParamsChange<VehicleDto>(
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
        (drawerState: DrawerState) => {
            updateFilters(
                "drawerState",
                drawerState !== DrawerState.Closed ? drawerState : undefined
            );
        },
        [updateFilters]
    );

    const showDeleteModal = useCallback((vehicle: VehicleDto) => {
        setVehicleToDelete(vehicle);
        setIsDeleteModalOpen(true);
    }, []);

    const handleDeleteConfirm = useCallback(async () => {
        try {
            if (vehicleToDelete) {
                await deleteVehicle(vehicleToDelete.id);

                setIsDeleteModalOpen(false);
                setVehicleToDelete(undefined);
            }
        } catch {
            setIsDeleteModalOpen(false);
        }
    }, [deleteVehicle, vehicleToDelete]);

    const handleDeleteCancel = useCallback(() => {
        setIsDeleteModalOpen(false);
        setVehicleToDelete(undefined);
    }, []);

    // #endregion

    useEffect(() => {
        if (search.selectedVehicleId) {
            setSelectedVehicle(
                vehicles?.items.find(
                    (vehicle) => vehicle.id === search.selectedVehicleId
                )
            );
        } else {
            updateFilters("selectedVehicleId", undefined);
        }
    }, [search.selectedVehicleId, updateFilters, vehicles?.items]);

    const columns = [
        {
            title: t(translations.vehicles.vin),
            dataIndex: "vin",
            ...getSearchFilter(),
            filteredValue: search.vin !== undefined ? [search.vin] : null,
            sorter: true,
        },
        {
            title: t(translations.vehicles.licensePlate),
            dataIndex: "licensePlate",
            ...getSearchFilter(),
            filteredValue:
                search.licensePlate !== undefined
                    ? [search.licensePlate]
                    : null,
            sorter: true,
        },
        {
            title: t(translations.vehicles.year),
            dataIndex: "year",
            ...getSearchFilter(),
            filteredValue: search.year !== undefined ? [search.year] : null,
            sorter: true,
        },
        {
            title: t(translations.vehicles.mileage),
            dataIndex: "mileage",
            ...getSearchFilter(),
            filteredValue:
                search.mileage !== undefined ? [search.mileage] : null,
            sorter: true,
        },
        {
            title: t(translations.vehicles.vehicleType),
            dataIndex: "vehicleType",
            ...getSearchFilter(),
            filteredValue:
                search.vehicleType !== undefined ? [search.vehicleType] : null,
            sorter: true,
            render: (value: number) => VehicleType[value],
        },
        {
            title: t(translations.vehicles.transmission),
            dataIndex: "transmission",
            ...getSearchFilter(),
            filteredValue:
                search.transmission !== undefined
                    ? [search.transmission]
                    : null,
            sorter: true,
            render: (value: number) => Transmission[value],
        },
        {
            title: t(translations.vehicles.fuelType),
            dataIndex: "fuelType",
            ...getSearchFilter(),
            filteredValue:
                search.fuelType !== undefined ? [search.fuelType] : null,
            sorter: true,
            render: (value: number) => FuelType[value],
        },
        {
            title: t(translations.vehicles.price),
            dataIndex: "price",
            ...getSearchFilter(),
            filteredValue: search.price !== undefined ? [search.price] : null,
            sorter: true,
            render: (value: number) => <p>€{value}/day</p>,
        },
        {
            title: t(translations.general.actions),
            key: "actions",
            render: (record: VehicleDto) => {
                const menuItems = [
                    {
                        key: "delete",
                        label: (
                            <Button
                                type="text"
                                danger
                                onClick={() => showDeleteModal(record)}
                            >
                                {t(translations.general.delete)}
                            </Button>
                        ),
                    },
                ];

                return (
                    <div onClick={(event) => event.stopPropagation()}>
                        <Dropdown
                            menu={{ items: menuItems }}
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
            <PageHeader
                title={t(translations.vehicles.title)}
                extra={[
                    <Button
                        key="1"
                        type="primary"
                        onClick={() => handleDrawerMode(DrawerState.Create)}
                    >
                        <PlusOutlined />
                        {t(translations.vehicles.addVehicle)}
                    </Button>,
                ]}
            />

            <Table
                columns={columns}
                dataSource={vehicles?.items}
                rowKey={(vehicle: VehicleDto): string => vehicle.id?.toString()}
                loading={isLoading}
                pagination={{
                    ...defaultTablePagination,
                    current: search.currentPage,
                    pageSize: search.pageSize,
                    total: vehicles?.totalItems,
                }}
                onChange={handleTableChange}
                bordered
            />

            <Drawer
                title={t(translations.vehicles.addVehicle)}
                open={!!search.drawerState}
                onClose={() => handleDrawerMode(DrawerState.Closed)}
                destroyOnClose
                width={DRAWER_WIDTH}
            >
                <VehiclesForm
                    onClose={() => handleDrawerMode(DrawerState.Closed)}
                    onSuccess={() => handleDrawerMode(DrawerState.Closed)}
                    vehicle={selectedVehicle}
                />
            </Drawer>

            <Modal
                title={t(translations.vehicles.confirmDeleteVehicle)}
                open={isDeleteModalOpen}
                onOk={handleDeleteConfirm}
                onCancel={handleDeleteCancel}
                okText={t(translations.general.yes)}
                cancelText={t(translations.general.no)}
            />
        </>
    );
}

export default Vehicles;
