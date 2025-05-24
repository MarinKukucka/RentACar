import { FuelType, OptionsDto, Transmission, VehicleType } from "../api/api";

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