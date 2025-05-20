import { TablePaginationConfig } from 'antd';

export const defaultTablePagination: TablePaginationConfig = {
    showSizeChanger: true,
    hideOnSinglePage: false,
    pageSizeOptions: ['5', '10', '25', '50'],
    defaultCurrent: 1,
    defaultPageSize: 10,
};

export const defaultFormat = 'DD.MM.YYYY.';
export const universalFormat = 'YYYY-MM-DD';
export const defaultFormatWithTime = 'DD.MM.YYYY. HH:mm';

export const xlsxType = 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet';

export const DRAWER_WIDTH = 730;

export const DEFAULT_CURRENT_PAGE = 1;
export const DEFAULT_PAGE_SIZE = 10;

export const roles = ['Admin', 'Agent'];

export const SEGMENT_ITEMS_COUNT = 5;

export const ATTENDEES_FORM_WORK_UNIT_ID = 0;