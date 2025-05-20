import { Button, Form, Input, Row, Select } from "antd";
import { CreateUserAndPersonCommand, PersonDto } from "../../api/api";
import { useCreateUserAndPersonMutation } from "../../api/people/people";
import { useCallback } from "react";
import { roles } from "../../config/constants";
import { SaveOutlined } from "@ant-design/icons";

interface Props {
    person?: PersonDto;
    onClose: () => void;
    onSuccess: () => void;
}

function PeopleForm({ person, onClose, onSuccess }: Props) {
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
                label="First name"
                rules={[{ required: true }]}
                initialValue={person}
            >
                <Input />
            </Form.Item>

            <Form.Item
                name="lastName"
                label="Last name"
                rules={[{ required: true }]}
            >
                <Input />
            </Form.Item>

            <Form.Item
                name="phoneNumber"
                label="Phone number"
                rules={[{ required: true }]}
            >
                <Input />
            </Form.Item>

            <Form.Item name="email" label="Email" rules={[{ required: true }]}>
                <Input />
            </Form.Item>

            <Form.Item
                name="password"
                label="Password"
                rules={[{ required: true }]}
            >
                <Input.Password />
            </Form.Item>

            <Form.Item
                label="Role"
                name="role"
                rules={[
                    {
                        required: true,
                    },
                ]}
            >
                <Select
                    placeholder="Please choose a role"
                    options={roles.map((role) => {
                        return {
                            value: role,
                            label: role,
                        };
                    })}
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

export default PeopleForm;
