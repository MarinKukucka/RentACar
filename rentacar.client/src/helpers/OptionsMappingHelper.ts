import { FuelType, OptionsDto, ReservationStatus, Transmission, VehicleType } from "../api/api";
import translations from "../config/localization/translations";

export interface SelectOption {
    label: string | undefined;
    value: number;
}

export const formatOptions = (options: OptionsDto[]): SelectOption[] => {
    return (
        options?.map((option: OptionsDto) => ({
            label: option.name,
            value: option.id,
        })) ?? []
    );
};

export const getVehicleTypeOptions = () => {
    return Object.entries(VehicleType)
        .filter(([, value]) => typeof value === 'number')
        .map(([key, value]) => ({
            key: key,
            label: key,
            value: value,
        }));
};

export const getTransmissionOptions = () => {
    return Object.entries(Transmission)
        .filter(([, value]) => typeof value === 'number')
        .map(([key, value]) => ({
            key: key,
            label: key,
            value: value,
        }));
};

export const getFuelTypeOptions = () => {
    return Object.entries(FuelType)
        .filter(([, value]) => typeof value === 'number')
        .map(([key, value]) => ({
            key: key,
            label: key,
            value: value,
        }));
};

export const getReservationStatusOptions = () => {
    return Object.entries(ReservationStatus)
        .filter(([, value]) => typeof value === 'number')
        .map(([key, value]) => ({
            key: key,
            label: key,
            value: value,
        }));
};

export const getEnumTranslation = (
    enumName: keyof typeof translations.enums,
    enumValue: string
): string => {
    if (!enumValue) {
        return '';
    }
    const enumTranslation: { [key: string]: string } = translations.enums[enumName];

    if (enumTranslation) {
        return enumTranslation[enumValue.toLowerCase()];
    }

    return '';
};