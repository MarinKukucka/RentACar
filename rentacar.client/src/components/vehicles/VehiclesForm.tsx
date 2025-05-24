/* eslint-disable @typescript-eslint/no-explicit-any */
import { useCallback, useState } from "react";
import { CreateVehicleCommand, VehicleDto } from "../../api/api";
import { useCreateVehicleMutation } from "../../api/vehicles/vehicles";
import { Button, Form, Input, InputNumber, Row, Select } from "antd";
import { SaveOutlined } from "@ant-design/icons";
import {
    getFuelTypeOptions,
    getTransmissionOptions,
    getVehicleTypeOptions,
} from "../../helpers/OptionsMappingHelper";
import { useFetchModelOptionsByBrandId } from "../../api/models/models";
import { useFetchLocationOptions } from "../../api/locations/locations";
import { useFetchBrandOptions } from "../../api/brands/brands";

interface Props {
    vehicle?: VehicleDto;
    onClose: () => void;
    onSuccess: () => void;
}

function VehiclesForm({ vehicle, onClose, onSuccess }: Props) {
    const [selectedBrandId, setSelectedBrandId] = useState<
        number | undefined
    >();

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
            <Form.Item name="vin" label="VIN" rules={[{ required: true }]}>
                <Input />
            </Form.Item>

            <Form.Item
                name="licensePlate"
                label="License plate"
                rules={[{ required: true }]}
            >
                <Input />
            </Form.Item>

            <Form.Item name="year" label="Year" rules={[{ required: true }]}>
                <InputNumber />
            </Form.Item>

            <Form.Item
                name="mileage"
                label="Mileage"
                rules={[{ required: true }]}
            >
                <InputNumber addonAfter="km" />
            </Form.Item>

            <Form.Item
                name="vehicleType"
                label="Vehicle type"
                rules={[
                    {
                        required: true,
                    },
                ]}
            >
                <Select<number>
                    placeholder="Please choose a vehicle type"
                    options={vehicleTypeOptions}
                />
            </Form.Item>

            <Form.Item
                name="transmission"
                label="Transmission"
                rules={[
                    {
                        required: true,
                    },
                ]}
            >
                <Select<number>
                    placeholder="Please choose a transmission"
                    options={transmissionOptions}
                />
            </Form.Item>

            <Form.Item
                name="fuelType"
                label="Fuel type"
                rules={[
                    {
                        required: true,
                    },
                ]}
            >
                <Select<number>
                    placeholder="Please choose a fuel type"
                    options={fuelTypeOptions}
                />
            </Form.Item>

            <Form.Item name="power" label="Power" rules={[{ required: true }]}>
                <InputNumber addonAfter="hp" />
            </Form.Item>

            <Form.Item name="seats" label="Seats" rules={[{ required: true }]}>
                <InputNumber />
            </Form.Item>

            <Form.Item
                name="brandId"
                label="Brand"
                rules={[
                    {
                        required: true,
                    },
                ]}
            >
                <Select<number>
                    placeholder="Please choose a brand"
                    options={brandOptions}
                />
            </Form.Item>

            <Form.Item
                name="modelId"
                label="Model"
                rules={[
                    {
                        required: true,
                    },
                ]}
            >
                <Select<number>
                    placeholder={
                        selectedBrandId
                            ? "Please choose a model"
                            : "First choose a brand"
                    }
                    options={modelOptions}
                    disabled={!selectedBrandId}
                />
            </Form.Item>

            <Form.Item
                name="locationId"
                label="Location"
                rules={[
                    {
                        required: true,
                    },
                ]}
            >
                <Select<number>
                    placeholder="Please choose a location"
                    options={locationOptions}
                />
            </Form.Item>

            <Row className="form-buttons">
                <Button type="default" onClick={onClose}>
                    Cancel
                </Button>
                <Button type="primary" htmlType="submit">
                    <SaveOutlined />
                    Save
                </Button>
            </Row>
        </Form>
    );
}

export default VehiclesForm;
