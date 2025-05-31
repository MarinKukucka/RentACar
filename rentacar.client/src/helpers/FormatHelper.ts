import dayjs, { Dayjs } from "dayjs";
import localizedFormat from "dayjs/plugin/localizedFormat";

dayjs.extend(localizedFormat); // needed for use of localized formats, e.g. format('L')

export const defaultDateFormat = (value: Dayjs) => value?.format("L");

export const defaultDateTimeFormat = (value: Dayjs) => value?.format("L LT");

export const formatDate = (value: Date | undefined): string | undefined => {
    if (!value) return;

    const date = dayjs(value);

    if (!date.isValid()) return;

    return defaultDateFormat(date);
};

export const formatDateTime = (value: Date | undefined): string | undefined => {
    if (!value) return;

    const date = dayjs(value);

    if (!date.isValid()) return;

    return defaultDateTimeFormat(date);
};

export const datePickerFormatProps = {
    getValueProps: (value: Date | undefined) => {
        return value ? { value: dayjs(value) } : {};
    },
    normalize: (value: Dayjs | null) => {
        return value ? value.toDate() : null;
    },
};
