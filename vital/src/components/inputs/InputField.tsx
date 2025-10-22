// Assuming your InputField accepts these props
import React from "react";

interface InputFieldProps {
    label: string;
    name: string;
    value: string;
    placeholder?: string;
    type?: string;
    onChange: (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => void;
    onValidationChange?: (isValid: boolean, fieldKey: string) => void;
    rules?: any[];
    textarea?: boolean; // <-- Add this
}

const InputField: React.FC<InputFieldProps> = ({
    label,
    name,
    value,
    placeholder,
    type = "text",
    onChange,
    textarea = false,
}) => {
    return (
        <div className="space-y-2">
            <label htmlFor={name} className="block font-medium">
                {label}
            </label>
            {textarea ? (
                <textarea
                    id={name}
                    name={name}
                    value={value}
                    onChange={onChange}
                    placeholder={placeholder}
                    className="w-full border rounded p-2 dark:bg-gray-700 dark:text-white"
                    rows={5}
                />
            ) : (
                <input
                    id={name}
                    name={name}
                    type={type}
                    value={value}
                    onChange={onChange}
                    placeholder={placeholder}
                    className="w-full border rounded p-2 dark:bg-gray-700 dark:text-white"
                />
            )}
        </div>
    );
};

export default InputField;
