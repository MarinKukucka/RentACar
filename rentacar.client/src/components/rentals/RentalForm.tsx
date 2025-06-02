import { useTranslation } from "react-i18next";
import { useCreateRentalMutation } from "../../api/rentals/rentals";
import { useCallback } from "react";
import { CreateRentalCommand } from "../../api/api";
import { Form, Input, InputNumber } from "antd";
import translations from "../../config/localization/translations";
import FormButtons from "../common/FormButtons";

interface Props {
    onClose: () => void;
    onSuccess: () => void;
    reservationId?: number;
}

function RentalForm({ onClose, onSuccess, reservationId }: Props) {
    const { t } = useTranslation();

    const { mutateAsync: createRental } = useCreateRentalMutation();

    // #region Callbacks

    const handleSubmit = useCallback(
        async (values: CreateRentalCommand) => {
            try {
                values.pickupDateTime = new Date();
                await createRental(values);
                onSuccess();
            } catch {
                onClose();
            }
        },
        [createRental, onClose, onSuccess]
    );

    // #endregion

    return (
        <Form
            onFinish={handleSubmit}
            labelCol={{ span: 10 }}
            wrapperCol={{ span: 14 }}
            style={{ maxWidth: 500 }}
        >
            <Form.Item
                name="odometerStart"
                label={t(translations.rentals.odometerStart)}
                rules={[{ required: true }]}
            >
                <InputNumber addonAfter={"km"} />
            </Form.Item>

            <Form.Item name="notes" label={t(translations.rentals.notes)}>
                <Input.TextArea rows={5} />
            </Form.Item>

            <Form.Item
                name="reservationId"
                initialValue={reservationId}
                hidden
            />

            <FormButtons onClose={onClose} />
        </Form>
    );
}

export default RentalForm;
