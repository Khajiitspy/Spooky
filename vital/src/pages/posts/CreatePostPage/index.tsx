import React from "react";
import PostForm from "../../../components/forms/PostForm.tsx";

const CreatePostPage: React.FC = () => {
    return (
        <div className="p-[20px] min-h-screen flex items-center justify-center bg-gray-50 dark:bg-gray-900">
            <div
                className="bg-white dark:bg-gray-800 p-10 rounded-xl shadow-md w-full max-w-2xl text-gray-900 dark:text-white"
            >
                <h2 className="text-3xl font-bold mb-6 text-center">Create a New Post</h2>
                <PostForm />
            </div>
        </div>
    );
};

export default CreatePostPage;
