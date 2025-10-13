import React, {useState} from "react";
import {Form, Input, Button, Row, Col, type UploadFile, type FormProps, message} from "antd";
import {useGoogleRegisterMutation, useRegisterMutation} from "../../services/userService.ts";
import type {IUserRegister} from "../../types/users/IUserRegister.ts";
import ImageUploader from "../uploaders/ImageUploader.tsx";
import {useDispatch} from "react-redux";
import {setTokens} from "../../store/authSlice.ts";
import {useNavigate} from "react-router";
import { useGoogleReCaptcha } from "react-google-recaptcha-v3";
import {GoogleLogin} from "@react-oauth/google";

const RegisterForm: React.FC = () => {
    const [form] = Form.useForm();
    const [register, { isLoading }] = useRegisterMutation();
    const [fileList, setFileList] = useState<UploadFile[]>([]);
    const [imageError, setImageError] = useState(false);
    const [googleRegister] = useGoogleRegisterMutation();
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const {executeRecaptcha} = useGoogleReCaptcha();

    const onFinish: FormProps<IUserRegister>["onFinish"] = async (values) => {
        if (fileList.length === 0 || !fileList[0]?.originFileObj) {
            setImageError(true);
            return;
        }

        if(!executeRecaptcha) return;

        const token = await executeRecaptcha('register');

        const userRegister: IUserRegister = {
            ...values,
            image: fileList[0].originFileObj,
            recaptcha_token: token,
        };

        try {
            console.log("Send Data Server", userRegister);
            const result = await register(userRegister).unwrap();
            console.log(result);
            dispatch(setTokens(result));
            navigate('/');
        } catch (err: any) {
            const errorMessage = err?.data?.errors?.Name?.[0];
            console.error(errorMessage);
        }
    };

    return (
        <Form
            form={form}
            layout="vertical"
            onFinish={onFinish}
            style={{ width: "100%" }}
        >
            <Form.Item
                label="Username"
                name="username"
                rules={[
                    { required: true, message: "Please enter your username" }
                ]}
            >
                <Input placeholder="johnsmith" />
            </Form.Item>

            <Row gutter={16}>
                <Col xs={24} md={12}>
                    <Form.Item
                        label="First name"
                        name="first_name"
                        rules={[{ required: true, message: "Please enter your first name" }]}
                    >
                        <Input placeholder="John" />
                    </Form.Item>
                </Col>
                <Col xs={24} md={12}>
                    <Form.Item
                        label="Last name"
                        name="last_name"
                        rules={[{ required: true, message: "Please enter your last name" }]}
                    >
                        <Input placeholder="Smith" />
                    </Form.Item>
                </Col>
            </Row>

            <Form.Item
                label="Email"
                name="email"
                rules={[
                    { required: true, message: "Please enter your email" },
                    { type: "email", message: "Invalid email format" },
                ]}
            >
                <Input placeholder="johnsmith@example.com" />
            </Form.Item>

            <Form.Item
                label="Password"
                name="password"
                rules={[{ required: true, message: "Please enter your password" }]}
            >
                <Input.Password placeholder="********" />
            </Form.Item>

            <Form.Item
                label="Зображення"
                required
                validateStatus={imageError ? "error" : ""}
                className="w-full text-center"
            >
                <ImageUploader
                    fileList={fileList}
                    setFileList={setFileList}
                    imageError={imageError}
                    setImageError={setImageError}
                />
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
                                    const result = await googleRegister({ token: id_token }).unwrap();
                                    dispatch(setTokens(result));
                                    navigate('/');
                                } catch (err) {
                                    console.error("Google registration failed:", err);
                                    message.error("Реєстрація через Google не вдалася");
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

export default RegisterForm;
