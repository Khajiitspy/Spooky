import { createApi } from "@reduxjs/toolkit/query/react";
import { createBaseQuery } from "../utils/createBaseQuery";
// import type { IPost } from "../types/posts/IPost"; // Optional if you define response types

export const postService = createApi({
    reducerPath: "postService",
    baseQuery: createBaseQuery("posts"),
    tagTypes: ["Posts"],

    endpoints: (builder) => ({
        createPost: builder.mutation<void,FormData>({
            query: (formData) => ({
                url: "",
                method: "POST",
                body: formData,
            }),
            invalidatesTags: ["Posts"],
        }),
    }),
});

export const { useCreatePostMutation } = postService;
