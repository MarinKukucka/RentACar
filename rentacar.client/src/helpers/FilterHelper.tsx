/* eslint-disable @typescript-eslint/no-explicit-any */
import { SearchOutlined } from "@ant-design/icons";
import { FilterDropdownProps } from "antd/es/table/interface";
import dayjs from "dayjs";
import React from "react";
import CheckboxFilter from "../components/filters/CheckboxFilter";
import DatePickerFilter from "../components/filters/DatePickerFilter";
import RadioFilter from "../components/filters/RadioFilter";
import SearchFilter from "../components/filters/SearchFilter";
import SelectFilter from "../components/filters/SelectFilter";
import { get } from "./UtilityHelper";
import { Option } from "../models/options";

export const getSearchFilter = (): any => {
    return {
        filterDropdown: (
            filterProps: FilterDropdownProps
        ): React.ReactElement => (
            <SearchFilter
                setSelectedKeys={filterProps.setSelectedKeys}
                selectedKeys={filterProps.selectedKeys}
                confirm={filterProps.confirm}
                clearFilters={filterProps.clearFilters}
            />
        ),
        filterIcon: (filtered: boolean): React.ReactNode => (
            <SearchOutlined
                style={{ color: filtered ? "#1890ff" : undefined }}
            />
        ),
    };
};

export const getDatePickerFilter = (): any => ({
    filterDropdown: (filterProps: FilterDropdownProps): React.ReactElement => (
        <DatePickerFilter
            setSelectedKeys={filterProps.setSelectedKeys}
            selectedKeys={filterProps.selectedKeys}
            confirm={filterProps.confirm}
            clearFilters={filterProps.clearFilters}
        />
    ),
});

export const getRadioFilter = (options: Option[]): any => ({
    filterDropdown: (filterProps: FilterDropdownProps): React.ReactElement => (
        <RadioFilter
            setSelectedKeys={filterProps.setSelectedKeys}
            selectedKeys={filterProps.selectedKeys}
            confirm={filterProps.confirm}
            clearFilters={filterProps.clearFilters}
            options={options}
        />
    ),
});

export const getSelectFilter = (
    options: Option[],
    multiple: boolean = false
): any => ({
    filterDropdown: (filterProps: FilterDropdownProps): React.ReactElement => (
        <SelectFilter
            setSelectedKeys={filterProps.setSelectedKeys}
            selectedKeys={filterProps.selectedKeys}
            confirm={filterProps.confirm}
            clearFilters={filterProps.clearFilters}
            options={options}
            multiple={multiple}
        />
    ),
});

export const getCheckboxFilter = (options: Option[]): any => ({
    filterDropdown: (filterProps: FilterDropdownProps): React.ReactElement => (
        <CheckboxFilter
            setSelectedKeys={filterProps.setSelectedKeys}
            selectedKeys={filterProps.selectedKeys}
            confirm={filterProps.confirm}
            clearFilters={filterProps.clearFilters}
            options={options}
        />
    ),
});

/**
 * Returns a string filter function.
 *
 * @param path - The path of the property being filtered
 * @returns A string filter function that checks if the property contains the value
 */
export const getDefaultFilter = (
    path: string
): ((value: string, record: any) => boolean) => {
    return (value: string, record: any): boolean => {
        const val = get(record, path);

        if (!val) return false;

        return val
            .toString()
            .toLowerCase()
            .includes(value.toString().toLowerCase());
    };
};

/**
 * Returns a number filter function.
 *
 * @param path - The path of the property being filtered
 * @returns A number filter function that checks if the property is equal to the value
 */
export const getNumberFilter = (
    path: string
): ((value: string, record: any) => boolean) => {
    return (value: string, record: any): boolean =>
        parseInt(get(record, path)) === parseInt(value);
};

/**
 * Returns a date filter function.
 *
 * @param path - The path of the property being filtered
 * @returns A date filter function that checks equality od dates (ignores time)
 */
export const getDateFilter = (
    path: string
): ((value: string, record: any) => boolean) => {
    return (value: string, record: any): boolean => {
        const val = get(record, path);

        if (!val) return false;

        return dayjs(val).isSame(dayjs(value), "day");
    };
};

/**
 * Returns a key filter function.
 *
 * @param path - The path of the property being filtered
 * @returns A key filter function that checks if the property is equal to one of the selected keys
 */
export const getKeyFilter = (
    path: string
): ((value: any, record: any) => boolean) => {
    return (value: any, record: any): boolean => {
        const val = get(record, path);
        if (val === null || val === undefined) return false;

        return val.toString() === value.toString();
    };
};
