import { createApi } from "@reduxjs/toolkit/query/react";
import { createBaseQuery } from "../utils/createBaseQuery";

export interface IPost {
    id: number;
    title: string;
    body: string;
    image?: string | null;
    video?: string | null;
    video_url?: string | null;
    created_at: string;
    user: number;
    topic: number;
}

export const postService = createApi({
    reducerPath: "postService",
    baseQuery: createBaseQuery("posts"),
    tagTypes: ["Posts"],

    endpoints: (builder) => ({
        getPosts: builder.query<IPost[], void>({
            query: () => "",
            providesTags: ["Posts"],
        }),

        createPost: builder.mutation<void, FormData>({
            query: (formData) => ({
                url: "",
                method: "POST",
                body: formData,
            }),
            invalidatesTags: ["Posts"],
        }),
    }),
});

export const { useGetPostsQuery, useCreatePostMutation } = postService;
