import * as v from 'valibot';
import { DrawerState } from './enums';

export type SearchPagination = {
    currentPage: number;
    pageSize: number;
};

export type SearchSort = {
    sortBy: string;
    sortOrder: 'ascend' | 'descend' | null;
};

export const SearchSortPaginationSchema = v.object({
    currentPage: v.number(),
    pageSize: v.number(),
    sortBy: v.optional(v.string()),
    sortOrder: v.optional(v.picklist(['ascend', 'descend'])),
});

export const DrawerSchema = v.object({
    drawerState: v.optional(v.enum(DrawerState)),
});

export type DrawerStateType = v.InferOutput<typeof DrawerSchema>;