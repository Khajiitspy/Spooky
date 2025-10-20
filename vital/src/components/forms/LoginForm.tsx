import {useMemo, useState} from "react";
import {useLoginMutation} from "../../services/userService.ts";
import {useDispatch} from "react-redux";
import {setTokens} from "../../store/authSlice.ts";
import {Link, useNavigate} from "react-router-dom";
import {useGoogleReCaptcha} from "react-google-recaptcha-v3";
import InputField from "../inputs/InputField"; // We'll define this below
import type {ILoginRequest} from "../../types/users/ILoginRequest";

const LoginForm: React.FC = () => {
    const [login, {isLoading}] = useLoginMutation();
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const {executeRecaptcha} = useGoogleReCaptcha();

    const [formData, setFormData] = useState<ILoginRequest>({
        username: '',
        password: '',
    });

    const [errors, setErrors] = useState<{ [key in keyof ILoginRequest]?: string }>({});

    const usernameRules = useMemo(() => [
        {
            rule: 'required',
            message: "Username is required"
        },
    ], []);

    const passwordRules = useMemo(() => [
        {
            rule: 'required',
            message: "Пароль є обов'язковим"
        },
    ], []);


    const validationChange = (isValid: boolean, key: string) => {
        setErrors((prevErrors) => {
            const updated = {...prevErrors};
            if (isValid) {
                delete updated[key as keyof ILoginRequest];
            } else {
                updated[key as keyof ILoginRequest] = "Invalid value";
            }
            return updated;
        });
    };

    const validate = (): boolean => {
        const newErrors: typeof errors = {};

        if (!formData.username) {
            newErrors.username = "Username is required";
        } 

        if (!formData.password) {
            newErrors.password = "Password is required";
        }

        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    const handleChange = (field: keyof ILoginRequest, value: string) => {
        setFormData(prev => ({...prev, [field]: value}));
        setErrors(prev => ({...prev, [field]: undefined}));
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        if (!validate()) return;

        try {
            if (!executeRecaptcha) return;
            const token = await executeRecaptcha("login");

            const result = await login({...formData, recaptcha_token: token}).unwrap();
            dispatch(setTokens(result));
            navigate("/");
        } catch (err: any) {
            console.error(err?.data?.message || "Login failed");
        }
    };

    return (
        <form onSubmit={handleSubmit} className="space-y-4">
            <InputField
                label="Username"
                name="username"
                type="text"
                placeholder="Please enter your username"
                value={formData.username}
                onChange={(e) => handleChange("username", e.target.value)}
                rules={usernameRules}
                onValidationChange={validationChange}
            />

            <InputField
                label={"Password"}
                name={"password"}
                type={"password"}
                placeholder="Please enter your password"
                value={formData.password}
                onChange={(e) => handleChange("password", e.target.value)}
                rules={passwordRules}
                onValidationChange={validationChange}
            />

            <div className="flex justify-between items-center">
                <Link to="/forgot-password" className="text-sm text-blue-500 hover:underline">
                    Forgot password?
                </Link>
            </div>

            <button
                type="submit"
                disabled={isLoading}
                className="bg-blue-600 text-white px-4 py-2 rounded w-full font-semibold hover:bg-blue-700 transition"
            >
                {isLoading ? "Logging in..." : "Login"}
            </button>
        </form>
    );
};

export default LoginForm;
