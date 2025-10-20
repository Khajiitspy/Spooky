import React from "react";
import RegisterForm from "../../../components/forms/RegisterForm.tsx";
// import { Typography } from "antd";

// const { Title, Text } = Typography;

const UserRegisterPage: React.FC = () => {
    return (
        <div className="p-[20px] min-h-screen flex items-center justify-center bg-gray-50 dark:bg-gray-900">
            <div
                className="w-full max-w-[900px] rounded-[16px] overflow-hidden shadow-[0_4px_20px_rgba(0,0,0,0.1)]"
            >
                <div className="grid grid-cols-1 md:grid-cols-2">
                    {/* Left Side (Welcome) */}
                    <div className="bg-[#1677ff] px-[60px] py-[40px] hidden md:block">
                        <h2 className="text-4xl text-white">Welcome!</h2>
                        <p className="text-white text-base mt-2">
                            Create your account to get started.
                        </p>
                    </div>

                    {/* Right Side (Form) */}
                    <div className="bg-white dark:bg-gray-800 px-[40px] py-[40px] text-gray-900 dark:text-white">
                        <div className="text-center mb-6">
                            <h3 className="text-3xl font-bold">REGISTER</h3>
                            <p className="text-sm">Enter your information to register</p>
                        </div>
                        <RegisterForm />
                    </div>
                </div>
            </div>
        </div>
    );
};

export default UserRegisterPage;
