export interface Option {
    key: string;
    label: string | Element;
    value: string | number | boolean;
    disabled?: boolean;
}

// Generic table filters only work with string, so Option.value HAS TO BE STRING