import { createFileRoute } from "@tanstack/react-router";
import {
    useFetchUserInfoQuery,
    useUpdateUserInfoMutation,
} from "../../api/identity/identity";
import Title from "antd/es/typography/Title";
import { Button, Card, Divider, Form, Input, Spin } from "antd";
import { UpdateUserInfoRequest } from "../../api/api";
import { useCallback } from "react";

export const Route = createFileRoute("/_authorizedRoutes/Profile")({
    component: Profile,
});

function Profile() {
    const { data: person, isLoading } = useFetchUserInfoQuery();

    const { mutateAsync: updateUserInfo } = useUpdateUserInfoMutation();

    // #region Callbacks

    const handleSubmit = useCallback(
        async (values: UpdateUserInfoRequest) => {
            try {
                await updateUserInfo(values);
                // eslint-disable-next-line @typescript-eslint/no-explicit-any
            } catch (err: any) {
                console.error("Server validation failed:", err.data ?? err);
            }
        },
        [updateUserInfo]
    );

    // #endregion

    if (isLoading) return <Spin />;

    return (
        <div>
            <Title level={3}>Profile</Title>
            <Form
                onFinish={handleSubmit}
                labelCol={{ span: 10 }}
                wrapperCol={{ span: 14 }}
                style={{ maxWidth: 500 }}
                initialValues={person}
            >
                <Card>
                    <Divider orientation="left">Account information</Divider>

                    <Form.Item label="email" name="email">
                        <Input />
                    </Form.Item>

                    <Form.Item<UpdateUserInfoRequest>
                        label="old password"
                        name="oldPassword"
                    >
                        <Input.Password autoComplete="current-password" />
                    </Form.Item>

                    <Form.Item<UpdateUserInfoRequest>
                        label="new password"
                        name="newPassword"
                        dependencies={["oldPassword"]}
                        rules={[
                            ({ getFieldValue }) => ({
                                validator(_, value) {
                                    if (
                                        !value ||
                                        getFieldValue("oldPassword")
                                    ) {
                                        return Promise.resolve();
                                    }
                                    return Promise.reject(
                                        new Error("potrebna stara lozinka")
                                    );
                                },
                            }),
                        ]}
                    >
                        <Input.Password autoComplete="new-password" />
                    </Form.Item>

                    <Divider orientation="left">Personal information</Divider>

                    <Form.Item<UpdateUserInfoRequest>
                        label="first name"
                        name="firstName"
                    >
                        <Input />
                    </Form.Item>

                    <Form.Item<UpdateUserInfoRequest>
                        label="last name"
                        name="lastName"
                    >
                        <Input />
                    </Form.Item>

                    <Form.Item<UpdateUserInfoRequest>
                        label="phone number"
                        name="phoneNumber"
                    >
                        <Input />
                    </Form.Item>

                    <Form.Item
                        name="clientId"
                        initialValue={import.meta.env.VITE_API_CLIENT_ID}
                        hidden
                    >
                        <Input />
                    </Form.Item>

                    <Form.Item wrapperCol={{ offset: 10 }}>
                        <Button type="primary" htmlType="submit">
                            SAVE
                        </Button>
                    </Form.Item>
                </Card>
            </Form>
        </div>
    );
}
