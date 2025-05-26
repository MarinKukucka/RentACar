import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { Button, Card, Flex, Form, Input } from "antd";
import { useCallback } from "react";
import { useLoginMutation } from "../../api/auth/auth";
import { LoginDto } from "../../api/api";
import "./Authorization.css";
import { useTranslation } from "react-i18next";
import translations from "../../config/localization/translations";

export const Route = createFileRoute("/_authorization/Login")({
    component: Login,
});

function Login() {
    const { t } = useTranslation();
    const navigate = useNavigate();

    const { mutateAsync: login } = useLoginMutation();

    const handleSubmit = useCallback(
        async (values: LoginDto) => {
            try {
                await login(values);

                window.dispatchEvent(new Event("authChange"));

                navigate({ to: "/people" });
            } catch {
                console.log("Failed");
            }
        },
        [login, navigate]
    );

    return (
        <div className="authorization-container">
            <Card className="authorization-card">
                <Flex gap={18} vertical>
                    <Form
                        onFinish={handleSubmit}
                        labelCol={{ span: 8 }}
                        wrapperCol={{ span: 16 }}
                        autoComplete="off"
                    >
                        <Form.Item
                            name="email"
                            label={t(translations.authorization.email)}
                            rules={[{ required: true }]}
                        >
                            <Input />
                        </Form.Item>
                        <Form.Item
                            name="password"
                            label={t(translations.authorization.password)}
                            rules={[{ required: true }]}
                        >
                            <Input.Password />
                        </Form.Item>
                        <Form.Item wrapperCol={{ offset: 8, span: 16 }}>
                            <Button type="primary" htmlType="submit">
                                {t(translations.authorization.login)}
                            </Button>
                        </Form.Item>
                    </Form>
                </Flex>
            </Card>
        </div>
    );
}

export default Login;
