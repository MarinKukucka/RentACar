import { useTranslation } from "react-i18next";
import {
    useCreateRentalMutation,
    useFinishRentalMutation,
} from "../../api/rentals/rentals";
import { useCallback, useState } from "react";
import { CreateRentalCommand } from "../../api/api";
import { Button, Form, Input, InputNumber, UploadFile } from "antd";
import translations from "../../config/localization/translations";
import FormButtons from "../common/FormButtons";
import { FinishRentalCommand } from "../../models/rentalCommands";
import Upload, { RcFile } from "antd/es/upload";
import { UploadOutlined } from "@ant-design/icons";

interface Props {
    onClose: () => void;
    onSuccess: () => void;
    reservationId?: number;
    rentalId?: number;
}

function RentalForm({ onClose, onSuccess, reservationId, rentalId }: Props) {
    const [fileList, setFileList] = useState<UploadFile[]>([]);

    const { t } = useTranslation();

    const { mutateAsync: createRental } = useCreateRentalMutation();
    const { mutateAsync: finishRental } = useFinishRentalMutation();

    // #region Callbacks

    const handleSubmit = useCallback(
        async (values: CreateRentalCommand | FinishRentalCommand) => {
            try {
                if (reservationId) {
                    const command = values as CreateRentalCommand;
                    command.pickupDateTime = new Date();
                    await createRental(command);
                } else if (rentalId) {
                    const command = values as FinishRentalCommand;
                    command.returnDateTime = new Date();

                    if (fileList && fileList.length > 0)
                        command.files = fileList
                            .filter((file) => file.originFileObj && file.name)
                            .map((file) => ({
                                data: file.originFileObj!,
                                fileName: file.name,
                            }));

                    await finishRental(command);
                }

                onSuccess();
            } catch {
                onClose();
            }
        },
        [
            createRental,
            fileList,
            finishRental,
            onClose,
            onSuccess,
            rentalId,
            reservationId,
        ]
    );

    const handleBeforeUpload = useCallback((file: RcFile) => {
        const newFile: UploadFile = {
            uid: file.uid,
            name: file.name,
            originFileObj: file,
        };
        setFileList((prevList) => [...prevList, newFile]);
        return false;
    }, []);

    // Remove a file based on its unique identifier
    const handleRemove = useCallback((file: UploadFile) => {
        setFileList((prevList) =>
            prevList.filter((item) => item.uid !== file.uid)
        );
    }, []);

    // #endregion

    return (
        <Form
            onFinish={handleSubmit}
            labelCol={{ span: 10 }}
            wrapperCol={{ span: 14 }}
            style={{ maxWidth: 500 }}
        >
            {reservationId && (
                <Form.Item
                    name="odometerStart"
                    label={t(translations.rentals.odometerStart)}
                    rules={[{ required: true }]}
                >
                    <InputNumber addonAfter={"km"} />
                </Form.Item>
            )}

            {reservationId && (
                <Form.Item
                    name="reservationId"
                    initialValue={reservationId}
                    hidden
                />
            )}

            {rentalId && (
                <Form.Item
                    name="odometerEnd"
                    label={t(translations.rentals.odometerEnd)}
                    rules={[{ required: true }]}
                >
                    <InputNumber addonAfter={"km"} />
                </Form.Item>
            )}

            {rentalId && (
                <Form.Item
                    name="offerFile"
                    label={t(translations.rentals.photos)}
                >
                    <Upload
                        multiple
                        onRemove={handleRemove}
                        beforeUpload={handleBeforeUpload}
                        fileList={fileList}
                    >
                        <Button icon={<UploadOutlined />}>
                            {t(translations.general.upload)}
                        </Button>
                    </Upload>
                </Form.Item>
            )}

            {(reservationId || rentalId) && (
                <Form.Item name="notes" label={t(translations.rentals.notes)}>
                    <Input.TextArea rows={5} />
                </Form.Item>
            )}

            <FormButtons onClose={onClose} />
        </Form>
    );
}

export default RentalForm;
