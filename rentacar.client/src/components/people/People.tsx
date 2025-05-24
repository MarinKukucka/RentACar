/* eslint-disable @typescript-eslint/no-explicit-any */
import { useNavigate } from "@tanstack/react-router";
import { PageHeader } from "@ant-design/pro-layout";
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
import {
    CheckOutlined,
    EllipsisOutlined,
    PlusOutlined,
    XOutlined,
} from "@ant-design/icons";
import { DrawerSchema, SearchSortPaginationSchema } from "../../models/search";
import { PersonDto } from "../../api/api";
import {
    useDisablePersonMutation,
    useFetchPaginatedPeopleQuery,
} from "../../api/people/people";
import { TableParamsChange } from "../../helpers/SearchHelper";
import { DrawerState } from "../../models/enums";
import { getSearchFilter } from "../../helpers/FilterHelper";
import { defaultTablePagination, DRAWER_WIDTH } from "../../config/constants";
import PeopleForm from "./PeopleForm";
import { Route } from "../../routes/_authorizedRoutes/people/index";

const PeopleFilters = v.intersect([
    SearchSortPaginationSchema,
    DrawerSchema,
    v.object({
        firstName: v.optional(v.string()),
        lastName: v.optional(v.string()),
        phoneNumber: v.optional(v.string()),
        selectedPersonId: v.optional(v.number()),
    }),
]);

export type PeopleFilters = v.InferOutput<typeof PeopleFilters>;

function People() {
    const [selectedPerson, setSelectedPerson] = useState<PersonDto>();
    const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
    const [personToDelete, setPersonToDelete] = useState<PersonDto>();

    const search: PeopleFilters = Route.useSearch();

    const navigate = useNavigate({ from: Route.fullPath });

    const { data: people, isLoading } = useFetchPaginatedPeopleQuery(search);

    const { mutateAsync: disablePerson } = useDisablePersonMutation();

    // #region Callbacks

    const updateFilters = useCallback(
        (name: keyof PeopleFilters, value: unknown) => {
            navigate({ search: (prev: any) => ({ ...prev, [name]: value }) });
        },
        [navigate]
    );

    const handleTableChange = useCallback(
        (
            pagination: TablePaginationConfig,
            filters: Record<string, FilterValue | null>,
            sorter: SorterResult<PersonDto> | SorterResult<PersonDto>[],
            { action }: { action: "paginate" | "sort" | "filter" }
        ) => {
            TableParamsChange<PersonDto>(
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

    const showDeleteModal = useCallback((person: PersonDto) => {
        setPersonToDelete(person);
        setIsDeleteModalOpen(true);
    }, []);

    const handleDeleteConfirm = useCallback(async () => {
        try {
            if (personToDelete) {
                await disablePerson(personToDelete.id);

                setIsDeleteModalOpen(false);
                setPersonToDelete(undefined);
            }
        } catch {
            setIsDeleteModalOpen(false);
        }
    }, [disablePerson, personToDelete]);

    const handleDeleteCancel = useCallback(() => {
        setIsDeleteModalOpen(false);
        setPersonToDelete(undefined);
    }, []);

    // #endregion

    useEffect(() => {
        if (search.selectedPersonId) {
            setSelectedPerson(
                people?.items.find(
                    (person) => person.id === search.selectedPersonId
                )
            );
        } else {
            updateFilters("selectedPersonId", undefined);
        }
    }, [people?.items, search.selectedPersonId, updateFilters]);

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
            title: "isActive",
            dataIndex: "isActive",
            render: (isActive: boolean) =>
                isActive ? <CheckOutlined /> : <XOutlined />,
        },
        {
            title: "actions",
            key: "actions",
            render: (record: PersonDto) => {
                const menuItems = [
                    {
                        key: "disable",
                        label: (
                            <Button
                                type="text"
                                danger
                                onClick={() => showDeleteModal(record)}
                            >
                                Disable
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
                        Add client
                    </Button>,
                ]}
            />

            <Table
                columns={columns}
                dataSource={people?.items}
                rowKey={(person: PersonDto): string => person.id?.toString()}
                loading={isLoading}
                pagination={{
                    ...defaultTablePagination,
                    current: search.currentPage,
                    pageSize: search.pageSize,
                    total: people?.totalItems,
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
                <PeopleForm
                    onClose={() => handleDrawerMode(DrawerState.Closed)}
                    onSuccess={() => handleDrawerMode(DrawerState.Closed)}
                    person={selectedPerson}
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

export default People;
