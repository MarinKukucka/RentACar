import { Form, Input, Select } from "antd";
import { CreateUserAndPersonCommand, PersonDto } from "../../api/api";
import { useCreateUserAndPersonMutation } from "../../api/people/people";
import { useCallback } from "react";
import { roles } from "../../config/constants";
import FormButtons from "../common/FormButtons";
import translations from "../../config/localization/translations";
import { useTranslation } from "react-i18next";

interface Props {
    person?: PersonDto;
    onClose: () => void;
    onSuccess: () => void;
}

function PeopleForm({ person, onClose, onSuccess }: Props) {
    const { t } = useTranslation();

    const { mutateAsync: createUserAndPerson } =
        useCreateUserAndPersonMutation();

    // #region Callbacks

    const handleSubmit = useCallback(
        async (values: CreateUserAndPersonCommand) => {
            try {
                await createUserAndPerson(values);
                onSuccess();
            } catch {
                onClose();
            }
        },
        [createUserAndPerson, onClose, onSuccess]
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
                name="firstName"
                label={t(translations.people.firstName)}
                rules={[{ required: true }]}
                initialValue={person}
            >
                <Input />
            </Form.Item>

            <Form.Item
                name="lastName"
                label={t(translations.people.lastName)}
                rules={[{ required: true }]}
            >
                <Input />
            </Form.Item>

            <Form.Item
                name="phoneNumber"
                label={t(translations.people.phoneNumber)}
                rules={[{ required: true }]}
            >
                <Input />
            </Form.Item>

            <Form.Item
                name="email"
                label={t(translations.people.email)}
                rules={[{ required: true }]}
            >
                <Input />
            </Form.Item>

            <Form.Item
                name="password"
                label={t(translations.people.password)}
                rules={[{ required: true }]}
            >
                <Input.Password />
            </Form.Item>

            <Form.Item
                name="role"
                label={t(translations.people.role)}
                rules={[
                    {
                        required: true,
                    },
                ]}
            >
                <Select
                    placeholder={t(translations.people.rolePlaceholder)}
                    options={roles.map((role) => {
                        return {
                            value: role,
                            label: role,
                        };
                    })}
                />
            </Form.Item>

            <FormButtons onClose={onClose} />
        </Form>
    );
}

export default PeopleForm;
