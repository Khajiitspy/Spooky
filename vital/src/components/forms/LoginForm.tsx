import React from "react";
import { Form, Input, Button } from "antd";
import { useLoginMutation } from "../../services/userService.ts";
import { useDispatch } from "react-redux";
import { setTokens } from "../../store/authSlice.ts";
import { useNavigate } from "react-router";

const LoginForm: React.FC = () => {
    const [form] = Form.useForm();
    const [login, { isLoading }] = useLoginMutation();
    const dispatch = useDispatch();
    const navigate = useNavigate();

    const onFinish = async (values: { username: string; password: string }) => {
        try {
            const result = await login(values).unwrap();
            dispatch(setTokens(result));
            navigate("/");
        } catch (error: any) {
            console.error("Login failed", error);
            form.setFields([
                {
                    name: 'username',
                    errors: ['Invalid credentials'],
                },
            ]);
        }
    };

    return (
        <Form form={form} layout="vertical" onFinish={onFinish}>
            <Form.Item
                label="Username"
                name="username"
                rules={[{ required: true, message: "Please enter your username" }]}
            >
                <Input placeholder="Username" />
            </Form.Item>

            <Form.Item
                label="Password"
                name="password"
                rules={[{ required: true, message: "Please enter your password" }]}
            >
                <Input.Password placeholder="Password" />
            </Form.Item>

            <Form.Item>
                <Button
                    type="primary"
                    htmlType="submit"
                    block
                    loading={isLoading}
                    style={{ height: "40px", fontWeight: 600 }}
                >
                    LOGIN
                </Button>
            </Form.Item>
        </Form>
    );
};

export default LoginForm;
