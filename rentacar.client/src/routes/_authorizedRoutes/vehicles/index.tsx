/* eslint-disable @typescript-eslint/no-explicit-any */
import { createFileRoute, useNavigate } from "@tanstack/react-router";
import * as v from "valibot";
import {
    DrawerSchema,
    SearchSortPaginationSchema,
} from "../../../models/search";
import { VehicleDto } from "../../../api/api";
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
import { TableParamsChange } from "../../../helpers/SearchHelper";
import { DrawerState } from "../../../models/enums";
import { getSearchFilter } from "../../../helpers/FilterHelper";
import { EllipsisOutlined, PlusOutlined } from "@ant-design/icons";
import { PageHeader } from "@ant-design/pro-layout";
import {
    defaultTablePagination,
    DRAWER_WIDTH,
} from "../../../config/constants";
import VehiclesForm from "../../../components/vehicles/VehiclesForm";

export const Route = createFileRoute("/_authorizedRoutes/vehicles/")({
    component: Vehicles,
});

const VehiclesFilter = v.intersect([
    SearchSortPaginationSchema,
    DrawerSchema,
    v.object({
        firstName: v.optional(v.string()),
        lastName: v.optional(v.string()),
        phoneNumber: v.optional(v.string()),
        selectedVehicleId: v.optional(v.number()),
    }),
]);

export type VehiclesFilter = v.InferOutput<typeof VehiclesFilter>;

function Vehicles() {
    const [selectedVehicle, setSelectedVehicle] = useState<VehicleDto>();
    const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
    const [vehicleToDelete, setVehicleToDelete] = useState<VehicleDto>();

    const search: VehiclesFilter = Route.useSearch();

    const navigate = useNavigate({ from: Route.fullPath });

    const { data: vehicles, isLoading } = useFetchPaginatedPeopleQuery(search);

    const { mutateAsync: deleteVehicle } = useDisablePersonMutation();

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
            title: "first name",
            dataIndex: "firstName",
            ...getSearchFilter(),
            filteredValue:
                search.firstName !== undefined ? [search.firstName] : null,
            sorter: true,
        },
        {
            title: "last name",
            dataIndex: "lastName",
            ...getSearchFilter(),
            filteredValue:
                search.lastName !== undefined ? [search.lastName] : null,
            sorter: true,
        },
        {
            title: "actions",
            key: "actions",
            render: (record: VehicleDto) => {
                const menuItems = [
                    {
                        key: "disable",
                        label: (
                            <Button
                                type="text"
                                danger
                                onClick={() => showDeleteModal(record)}
                            >
                                Delete
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
                title="Workers"
                extra={[
                    <Button
                        key="1"
                        type="primary"
                        onClick={() => handleDrawerMode(DrawerState.Create)}
                    >
                        <PlusOutlined />
                        Add vehicle
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
                title="Add"
                open={!!search.drawerState}
                onClose={() => handleDrawerMode(DrawerState.Closed)}
                destroyOnClose
                width={DRAWER_WIDTH}
            >
                <VehiclesForm
                    onClose={() => handleDrawerMode(DrawerState.Closed)}
                    onSuccess={() => handleDrawerMode(DrawerState.Closed)}
                    person={selectedVehicle}
                />
            </Drawer>

            <Modal
                title="Are you sure that you want to disable this person?"
                open={isDeleteModalOpen}
                onOk={handleDeleteConfirm}
                onCancel={handleDeleteCancel}
                okText="Yes"
                cancelText="No"
            />
        </>
    );
}

export default Vehicles;
