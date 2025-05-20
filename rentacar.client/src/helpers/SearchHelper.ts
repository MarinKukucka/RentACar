/* eslint-disable @typescript-eslint/no-explicit-any */
import { TablePaginationConfig } from 'antd';
import { FilterValue, Key } from 'antd/es/table/interface';
import { SorterResult } from 'antd/es/table/interface';
import { replaceDotsWithUnderscore } from './ObjectHelper';

type SorterProps = Key | readonly Key[] | string[] | string | null | undefined;

export const TableParamsChange = <T>(
    pagination: TablePaginationConfig,
    filters: Record<string, FilterValue | null>,
    sorter: SorterResult<T> | SorterResult<T>[],
    action: 'paginate' | 'sort' | 'filter',
    updateFilters: (name: any, value: unknown) => void
) => {
    switch (action) {
        case 'filter':
            replaceDotsWithUnderscore(filters);
            Object.keys(filters).forEach((key) => {
                updateFilters(key, filters?.[key] !== null ? filters[key][0] : undefined);
            });
            updateFilters('currentPage', 1);
            break;
        case 'sort':
            updateFilters(
                'sortBy',
                Array.isArray(sorter) ? adjustSorter(sorter[0].field) : adjustSorter(sorter.field)
            );
            updateFilters(
                'sortOrder',
                Array.isArray(sorter) ? adjustSorter(sorter[0].order) : adjustSorter(sorter.order)
            );
            break;
        case 'paginate':
            updateFilters('currentPage', pagination.current);
            updateFilters('pageSize', pagination.pageSize);
            break;
        default:
            break;
    }
};

export const adjustSorter = (entries: SorterProps): SorterProps => {
    return !entries || !Array.isArray(entries) ? entries : entries.join('_');
};
