import React, { useState, useMemo } from "react";
import { useRegisterMutation } from "../../services/userService";
import { useDispatch } from "react-redux";
import { setTokens } from "../../store/authSlice";
import { useNavigate } from "react-router-dom";
import { useGoogleReCaptcha } from "react-google-recaptcha-v3";
import InputField from "../inputs/InputField";
import ImageUploader from "../uploaders/ImageUploader";
import type { IUserRegister } from "../../types/users/IUserRegister";
import type { UploadFile } from "antd";

const RegisterForm: React.FC = () => {
    const [formData, setFormData] = useState<IUserRegister>({
        username: "",
        first_name: "",
        last_name: "",
        email: "",
        password: "",
        image: undefined,
        recaptcha_token: "",
    });

    const [errors, setErrors] = useState<Partial<Record<keyof IUserRegister, string>>>({});
    const [fileList, setFileList] = useState<UploadFile[]>([]);
    const [imageError, setImageError] = useState(false);

    const [register, { isLoading }] = useRegisterMutation();
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const { executeRecaptcha } = useGoogleReCaptcha();

    const handleChange = (field: keyof IUserRegister, value: string) => {
        setFormData(prev => ({ ...prev, [field]: value }));
        setErrors(prev => ({ ...prev, [field]: undefined }));
    };

    const validationChange = (isValid: boolean, key: string) => {
        setErrors(prevErrors => {
            const updated = { ...prevErrors };
            if (isValid) {
                delete updated[key as keyof IUserRegister];
            } else {
                updated[key as keyof IUserRegister] = "Invalid value";
            }
            return updated;
        });
    };

    const validateForm = () => {
        const newErrors: typeof errors = {};

        if (!formData.username) newErrors.username = "Username is required";
        if (!formData.first_name) newErrors.first_name = "First name is required";
        if (!formData.last_name) newErrors.last_name = "Last name is required";
        if (!formData.email) newErrors.email = "Email is required";
        if (!formData.password) newErrors.password = "Password is required";
        if (fileList.length === 0 || !fileList[0]?.originFileObj) {
            setImageError(true);
        }

        setErrors(newErrors);
        return Object.keys(newErrors).length === 0 && !imageError;
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        if (!validateForm()) return;
        if (!executeRecaptcha) return;

        const token = await executeRecaptcha("register");

        const userRegister: IUserRegister = {
            ...formData,
            image: fileList[0].originFileObj!,
            recaptcha_token: token,
        };

        try {
            const result = await register(userRegister).unwrap();
            dispatch(setTokens(result));
            navigate("/");
        } catch (err: any) {
            console.error(err?.data?.message || "Registration failed");
        }
    };

    const emailRules = useMemo(() => [
        {
            rule: "required",
            message: "Email is required",
        },
        {
            rule: "regexp",
            value: '^[\\w-.]+@([\\w-]+\\.)+[\\w-]{2,4}$',
            message: "Invalid email format",
        },
    ], []);

    const usernameRules = useMemo(() => [
        { rule: "required", message: "Username is required" }
    ], []);

    const firstNameRules = useMemo(() => [
        { rule: "required", message: "First Name is required" }
    ], []);

    const lastNameRules = useMemo(() => [
        { rule: "required", message: "Last Name is required" }
    ], []);

    const passwordRules = useMemo(() => [
        { rule: "required", message: "Password is required" }
    ], []);


    return (
        <form onSubmit={handleSubmit} className="space-y-4">
            <InputField
                label="Username"
                name="username"
                value={formData.username}
                onChange={(e) => handleChange("username", e.target.value)}
                rules={usernameRules}
                onValidationChange={validationChange}
                placeholder="johnsmith"
            />

            <div className="flex gap-4 flex-col md:flex-row">
                <InputField
                    label="First Name"
                    name="first_name"
                    value={formData.first_name}
                    onChange={(e) => handleChange("first_name", e.target.value)}
                    rules={firstNameRules}
                    onValidationChange={validationChange}
                    placeholder="John"
                    otherStyles="w-full"
                />
                <InputField
                    label="Last Name"
                    name="last_name"
                    value={formData.last_name}
                    onChange={(e) => handleChange("last_name", e.target.value)}
                    rules={lastNameRules}
                    onValidationChange={validationChange}
                    placeholder="Smith"
                    otherStyles="w-full"
                />
            </div>

            <InputField
                label="Email"
                name="email"
                type="email"
                value={formData.email}
                onChange={(e) => handleChange("email", e.target.value)}
                rules={emailRules}
                onValidationChange={validationChange}
                placeholder="john@example.com"
            />

            <InputField
                label="Password"
                name="password"
                type="password"
                value={formData.password}
                onChange={(e) => handleChange("password", e.target.value)}
                rules={passwordRules}
                onValidationChange={validationChange}
                placeholder="********"
            />

            <div className={`w-full mb-4`}>
                <label className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">
                    Profile Image
                </label>
                <ImageUploader
                    fileList={fileList}
                    setFileList={setFileList}
                    imageError={imageError}
                    setImageError={setImageError}
                />
                {imageError && (
                    <div className="p-1 text-sm text-red-800 dark:text-red-400" role="alert">
                        <span className="font-medium">Image is required</span>
                    </div>
                )}
            </div>

            <button
                type="submit"
                disabled={isLoading}
                className="bg-blue-600 text-white px-4 py-2 rounded w-full font-semibold hover:bg-blue-700 transition"
            >
                {isLoading ? "Registering..." : "Register"}
            </button>
        </form>
    );
};

export default RegisterForm;
