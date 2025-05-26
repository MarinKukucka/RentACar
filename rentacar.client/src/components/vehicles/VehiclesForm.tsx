/* eslint-disable @typescript-eslint/no-explicit-any */
import { useCallback, useState } from "react";
import { CreateVehicleCommand, VehicleDto } from "../../api/api";
import { useCreateVehicleMutation } from "../../api/vehicles/vehicles";
import { Form, Input, InputNumber, Select } from "antd";
import {
    getFuelTypeOptions,
    getTransmissionOptions,
    getVehicleTypeOptions,
} from "../../helpers/OptionsMappingHelper";
import { useFetchModelOptionsByBrandId } from "../../api/models/models";
import { useFetchLocationOptions } from "../../api/locations/locations";
import { useFetchBrandOptions } from "../../api/brands/brands";
import FormButtons from "../common/FormButtons";
import { useTranslation } from "react-i18next";
import translations from "../../config/localization/translations";

interface Props {
    vehicle?: VehicleDto;
    onClose: () => void;
    onSuccess: () => void;
}

function VehiclesForm({ vehicle, onClose, onSuccess }: Props) {
    const [selectedBrandId, setSelectedBrandId] = useState<
        number | undefined
    >();

    const { t } = useTranslation();
    const [form] = Form.useForm();

    const { data: brandOptions } = useFetchBrandOptions();
    const { data: modelOptions } =
        useFetchModelOptionsByBrandId(selectedBrandId);
    const { data: locationOptions } = useFetchLocationOptions();

    const { mutateAsync: createVehicle } = useCreateVehicleMutation();

    const vehicleTypeOptions = getVehicleTypeOptions();
    const transmissionOptions = getTransmissionOptions();
    const fuelTypeOptions = getFuelTypeOptions();

    // #region Callbacks

    const handleSubmit = useCallback(
        async (values: CreateVehicleCommand) => {
            try {
                await createVehicle(values);
                onSuccess();
            } catch {
                onClose();
            }
        },
        [createVehicle, onClose, onSuccess]
    );

    const handleValuesChange = useCallback(
        (changedValues: Record<string, any>) => {
            if (changedValues.brandId) {
                setSelectedBrandId(changedValues.brandId);
                form.setFieldsValue({ modelId: undefined });
            }
        },
        [form]
    );

    // #endregion

    return (
        <Form
            form={form}
            onValuesChange={handleValuesChange}
            onFinish={handleSubmit}
            labelCol={{ span: 10 }}
            wrapperCol={{ span: 14 }}
            style={{ maxWidth: 500 }}
            initialValues={vehicle}
        >
            <Form.Item
                name="vin"
                label={t(translations.vehicles.vin)}
                rules={[{ required: true }]}
            >
                <Input />
            </Form.Item>

            <Form.Item
                name="licensePlate"
                label={t(translations.vehicles.licensePlate)}
                rules={[{ required: true }]}
            >
                <Input />
            </Form.Item>

            <Form.Item
                name="year"
                label={t(translations.vehicles.year)}
                rules={[{ required: true }]}
            >
                <InputNumber />
            </Form.Item>

            <Form.Item
                name="mileage"
                label={t(translations.vehicles.mileage)}
                rules={[{ required: true }]}
            >
                <InputNumber addonAfter="km" />
            </Form.Item>

            <Form.Item
                name="vehicleType"
                label={t(translations.vehicles.vehicleType)}
                rules={[
                    {
                        required: true,
                    },
                ]}
            >
                <Select<number>
                    placeholder={t(
                        translations.vehicles.chooseVehicleTypePlaceholder
                    )}
                    options={vehicleTypeOptions}
                />
            </Form.Item>

            <Form.Item
                name="transmission"
                label={t(translations.vehicles.transmission)}
                rules={[
                    {
                        required: true,
                    },
                ]}
            >
                <Select<number>
                    placeholder={t(
                        translations.vehicles.chooseTransmissionPlaceholder
                    )}
                    options={transmissionOptions}
                />
            </Form.Item>

            <Form.Item
                name="fuelType"
                label={t(translations.vehicles.fuelType)}
                rules={[
                    {
                        required: true,
                    },
                ]}
            >
                <Select<number>
                    placeholder={t(
                        translations.vehicles.chooseFuelTypePlaceholder
                    )}
                    options={fuelTypeOptions}
                />
            </Form.Item>

            <Form.Item
                name="power"
                label={t(translations.vehicles.power)}
                rules={[{ required: true }]}
            >
                <InputNumber addonAfter="hp" />
            </Form.Item>

            <Form.Item
                name="seats"
                label={t(translations.vehicles.seats)}
                rules={[{ required: true }]}
            >
                <InputNumber />
            </Form.Item>

            <Form.Item
                name="price"
                label={t(translations.vehicles.price)}
                rules={[{ required: true }]}
            >
                <InputNumber addonAfter="€/day" />
            </Form.Item>

            <Form.Item
                name="brandId"
                label={t(translations.vehicles.brand)}
                rules={[
                    {
                        required: true,
                    },
                ]}
            >
                <Select<number>
                    placeholder={t(
                        translations.vehicles.chooseBrandPlaceholder
                    )}
                    options={brandOptions}
                />
            </Form.Item>

            <Form.Item
                name="modelId"
                label={t(translations.vehicles.model)}
                rules={[
                    {
                        required: true,
                    },
                ]}
            >
                <Select<number>
                    placeholder={t(
                        selectedBrandId
                            ? translations.vehicles.chooseModelPlaceholder
                            : translations.vehicles.chooseBrandFirstPlaceholder
                    )}
                    options={modelOptions}
                    disabled={!selectedBrandId}
                />
            </Form.Item>

            <Form.Item
                name="locationId"
                label={t(translations.vehicles.location)}
                rules={[
                    {
                        required: true,
                    },
                ]}
            >
                <Select<number>
                    placeholder={t(
                        translations.vehicles.chooseLocationPlaceholder
                    )}
                    options={locationOptions}
                />
            </Form.Item>

            <FormButtons onClose={onClose} />
        </Form>
    );
}

export default VehiclesForm;
