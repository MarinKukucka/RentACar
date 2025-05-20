import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { Button, Card, Flex, Form, Input } from "antd";
import { useCallback } from "react";
import { useLoginMutation } from "../../api/auth/auth";
import { LoginDto } from "../../api/api";
import "./Authorization.css";

export const Route = createFileRoute("/_authorization/Login")({
    component: Login,
});

function Login() {
    const navigate = useNavigate();

    const { mutateAsync: login } = useLoginMutation();

    const handleSubmit = useCallback(
        async (values: LoginDto) => {
            try {
                await login(values);
                navigate({ to: "/" });
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
                            label="Email"
                            name="email"
                            rules={[{ required: true }]}
                        >
                            <Input />
                        </Form.Item>
                        <Form.Item
                            label="Password"
                            name="password"
                            rules={[{ required: true }]}
                        >
                            <Input.Password />
                        </Form.Item>
                        <Form.Item wrapperCol={{ offset: 8, span: 16 }}>
                            <Button type="primary" htmlType="submit">
                                Login
                            </Button>
                        </Form.Item>
                    </Form>
                </Flex>
            </Card>
        </div>
    );
}

export default Login;
