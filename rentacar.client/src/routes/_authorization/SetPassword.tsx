import { CarOutlined } from "@ant-design/icons";
import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { Button, Card, Flex, Form, Input } from "antd";
import { useCallback, useState } from "react";
import * as v from "valibot";
import translations from "../../config/localization/translations";
import { useTranslation } from "react-i18next";
import { useSetPasswordMutation } from "../../api/identity/identity";
import { SetPasswordDto } from "../../api/api";

export const Route = createFileRoute("/_authorization/SetPassword")({
    component: SetPassword,
});

const SetPasswordParams = v.object({
    email: v.string(),
    token: v.string(),
});

export type SetPasswordParams = v.InferOutput<typeof SetPasswordParams>;

function SetPassword() {
    const [password, setPassword] = useState("");
    const [confirmPassword, setConfirmPassword] = useState("");
    const [error, setError] = useState<string | null>(null);

    const search: SetPasswordParams = Route.useSearch();
    const navigate = useNavigate();
    const { t } = useTranslation();

    const { mutateAsync: setPasswordAsync, isSuccess } =
        useSetPasswordMutation();

    const handleSubmit = useCallback(
        async (values: SetPasswordDto) => {
            try {
                if (!password || !confirmPassword) {
                    setError("Password required!");
                    return;
                }
                if (password !== confirmPassword) {
                    setError("Password do not match!");
                    return;
                }

                values.email = search.email;
                values.token = search.token;

                await setPasswordAsync(values);

                if (isSuccess) {
                    navigate({ to: "/Login" });
                }
            } catch {
                setError("Network error");
            }
        },
        [
            confirmPassword,
            isSuccess,
            navigate,
            password,
            search.email,
            search.token,
            setPasswordAsync,
        ]
    );

    if (!search.email || !search.token) {
        return (
            <div>
                Invalid link. Make sure you opened the link from your email.
            </div>
        );
    }

    return (
        <div className="authorization-container">
            <div style={{ fontSize: "50px" }}>
                <CarOutlined style={{ marginRight: "0.5rem" }} />
                {t(translations.general.appName)}
            </div>
            <Card
                className="authorization-card"
                style={{ backgroundColor: "white" }}
            >
                <Flex gap={18} vertical>
                    <Form
                        onFinish={handleSubmit}
                        labelCol={{ span: 8 }}
                        wrapperCol={{ span: 16 }}
                        autoComplete="off"
                    >
                        <Form.Item
                            name="password"
                            label={t(translations.authorization.password)}
                            rules={[{ required: true }]}
                        >
                            <Input.Password
                                onChange={(e) => setPassword(e.target.value)}
                            />
                        </Form.Item>
                        <Form.Item
                            name="confirmPassword"
                            label={t(
                                translations.authorization.confirmPassword
                            )}
                            rules={[{ required: true }]}
                        >
                            <Input.Password
                                onChange={(e) =>
                                    setConfirmPassword(e.target.value)
                                }
                            />
                        </Form.Item>

                        <Form.Item wrapperCol={{ offset: 8, span: 16 }}>
                            <Button type="primary" htmlType="submit">
                                {t(translations.authorization.setPassword)}
                            </Button>
                        </Form.Item>
                        {error && <div style={{ color: "red" }}>{error}</div>}
                        {isSuccess && (
                            <div style={{ color: "green" }}>
                                Password is set
                            </div>
                        )}
                    </Form>
                </Flex>
            </Card>
        </div>
    );
}

export default SetPassword;
