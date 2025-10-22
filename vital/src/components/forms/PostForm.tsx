import React, { useState } from "react";
import { useCreatePostMutation } from "../../services/postService.ts"; // You’ll need to create this
import BaseButton from "../buttons/BaseButton.tsx";
import InputField from "../inputs/InputField.tsx";
import { useSelector } from "react-redux";
import { selectCurrentUser } from "../../store/authSlice";
import { useGetTopicsQuery } from "../../services/topicService";

const PostForm: React.FC = () => {
    const [form, setForm] = useState({
        title: "",
        body: "",
        topic: "",
        video_url: "",
        image: null as File | null,
        video: null as File | null,
    });

    const user = useSelector(selectCurrentUser);
    const { data: topics, isLoading: topicsLoading } = useGetTopicsQuery();

    const [createPost, { isLoading }] = useCreatePostMutation();

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        const { name, value } = e.target;
        setForm((prev) => ({ ...prev, [name]: value }));
    };

    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, files } = e.target;
        if (files && files[0]) {
            setForm((prev) => ({ ...prev, [name]: files[0] }));
        }
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        if (!user) {
            alert("You must be logged in to create a post.");
            return;
        }

        const formData = new FormData();

        Object.entries(form).forEach(([key, value]) => {
            if (value) formData.append(key, value);
        });

        formData.append("user", String(user.id));

        try {
            await createPost(formData).unwrap();
            alert("Post created!");
            setForm({ title: "", body: "",topic: "", video_url: "", image: null, video: null });
        } catch (err) {
            console.error("Post creation failed", err);
        }
    };

    return (
        <form onSubmit={handleSubmit} className="space-y-4 text-gray-900 dark:text-white">
            <InputField name="title" label="Title" value={form.title} onChange={handleChange} rules={[]} />
            <InputField name="body" label="Body" value={form.body} onChange={handleChange} rules={[]} textarea />
            <div className="space-y-2">
                <label htmlFor="topic" className="block font-medium">Select Topic</label>
                <select
                    id="topic"
                    name="topic"
                    value={form.topic}
                    onChange={(e) => setForm({ ...form, topic: e.target.value })}
                    className="w-full border rounded p-2 dark:bg-gray-700 dark:text-white"
                    required
                >
                    <option value="">-- Select a topic --</option>
                    {topicsLoading ? (
                        <option disabled>Loading topics...</option>
                    ) : (
                        topics?.map((topic) => (
                            <option key={topic.id} value={topic.id}>
                                {topic.name}
                            </option>
                        ))
                    )}
                </select>
            </div>
            <InputField name="video_url" label="Video URL" value={form.video_url} onChange={handleChange} rules={[]} />
            <div>
                <label>Image:</label>
                <input type="file" name="image" onChange={handleFileChange} className="block" />
            </div>
            <div>
                <label>Video:</label>
                <input type="file" name="video" onChange={handleFileChange} className="block" />
            </div>
            <BaseButton
                type="submit"
                className="w-full rounded-xl !bg-purple-500 dark:!bg-gray-900 text-white font-medium py-2"
            >
                {isLoading ? "Creating..." : "Create Post"}
            </BaseButton>
        </form>
    );
};

export default PostForm;
