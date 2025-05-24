/* eslint-disable @typescript-eslint/no-explicit-any */
import { createFileRoute } from "@tanstack/react-router";
import {
    useFetchUserInfoQuery,
    useUpdateUserInfoMutation,
} from "../../api/identity/identity";
import Title from "antd/es/typography/Title";
import { Button, Card, Divider, Form, Input, Spin } from "antd";
import { UpdateUserInfoRequest } from "../../api/api";
import { useCallback } from "react";
import { useTranslation } from "react-i18next";
import translations from "../../config/localization/translations";

export const Route = createFileRoute("/_authorizedRoutes/Profile")({
    component: Profile,
});

function Profile() {
    const { t } = useTranslation();

    const { data: person, isLoading } = useFetchUserInfoQuery();

    const { mutateAsync: updateUserInfo } = useUpdateUserInfoMutation();

    // #region Callbacks

    const handleSubmit = useCallback(
        async (values: UpdateUserInfoRequest) => {
            try {
                await updateUserInfo(values);
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
            <Title level={3}>{t(translations.profile.title)}</Title>
            <Form
                onFinish={handleSubmit}
                labelCol={{ span: 10 }}
                wrapperCol={{ span: 14 }}
                style={{ maxWidth: 500 }}
                initialValues={person}
            >
                <Card>
                    <Divider orientation="left">
                        {t(translations.profile.accountInformation)}
                    </Divider>

                    <Form.Item
                        name="email"
                        label={t(translations.profile.email)}
                    >
                        <Input />
                    </Form.Item>

                    <Form.Item<UpdateUserInfoRequest>
                        name="oldPassword"
                        label={t(translations.profile.oldPassword)}
                    >
                        <Input.Password autoComplete="current-password" />
                    </Form.Item>

                    <Form.Item<UpdateUserInfoRequest>
                        name="newPassword"
                        label={t(translations.profile.newPassword)}
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

                    <Divider orientation="left">
                        {t(translations.profile.personalInformation)}
                    </Divider>

                    <Form.Item<UpdateUserInfoRequest>
                        name="firstName"
                        label={t(translations.profile.firstName)}
                    >
                        <Input />
                    </Form.Item>

                    <Form.Item<UpdateUserInfoRequest>
                        name="lastName"
                        label={t(translations.profile.lastName)}
                    >
                        <Input />
                    </Form.Item>

                    <Form.Item<UpdateUserInfoRequest>
                        name="phoneNumber"
                        label={t(translations.profile.phoneNumber)}
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
                            {t(translations.general.save)}
                        </Button>
                    </Form.Item>
                </Card>
            </Form>
        </div>
    );
}
