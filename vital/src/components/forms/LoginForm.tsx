import React from "react";
import { message, Form, Input, Button } from "antd";
import { useLoginMutation, useLoginByGoogleMutation } from "../../services/userService.ts";
import { useDispatch } from "react-redux";
import { setTokens } from "../../store/authSlice.ts";
import { useNavigate } from "react-router";
import { useGoogleReCaptcha } from "react-google-recaptcha-v3";
import {GoogleLogin} from "@react-oauth/google";


const LoginForm: React.FC = () => {
    const [form] = Form.useForm();
    const [login, { isLoading }] = useLoginMutation();
    const [loginByGoogle ] = useLoginByGoogleMutation();
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const {executeRecaptcha} = useGoogleReCaptcha();

    const onFinish = async (values: { username: string; password: string }) => {
        try {
            if(!executeRecaptcha) return;

            const token = await executeRecaptcha('register');

            const result = await login({...values, recaptcha_token: token}).unwrap();
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

    // const loginUseGoogle = useGoogleLogin({
    //     onSuccess: async (tokenResponse) =>
    //     {
    //         try {
    //             const result = await loginByGoogle({token: tokenResponse.access_token}).unwrap();
    //             dispatch(setTokens(result));
    //             navigate('/');
    //         } catch (error) {

    //             console.log("User server error auth", error);
    //         }
    //     },
    // });

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
                <div className="flex flex-col sm:flex-row items-center gap-4">
                    <Button
                        type="primary"
                        htmlType="submit"
                        loading={isLoading}
                        className="w-full sm:w-auto bg-orange-500 hover:bg-orange-600 text-white font-medium py-2 px-4 rounded-lg transition"
                    >
                        Увійти
                    </Button>

                    <div className="w-full sm:w-auto">
                        <GoogleLogin
                            onSuccess={async (credentialResponse) => {
                                const { credential: id_token } = credentialResponse;

                                if (!id_token) {
                                    console.error('No ID token received');
                                    return;
                                }

                                try {
                                    const result = await loginByGoogle({ token: id_token }).unwrap();
                                    dispatch(setTokens(result));
                                    navigate('/');
                                } catch (err) {
                                    console.error("Google login failed:", err);
                                    message.error("Login через Google не вдався");
                                }
                            }}
                            onError={() => {
                                message.error("Google login failed");
                            }}
                            size="medium"
                            theme="outline"
                            width="100%"
                        />
                    </div>
                </div>
            </Form.Item>
        </Form>
    );
};

export default LoginForm;
