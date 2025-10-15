import {createApi} from '@reduxjs/toolkit/query/react';
import {createBaseQuery} from '../utils/createBaseQuery';
import type {ITopicItem} from '../types/topics/ITopicItem';

export const topicService = createApi({
    reducerPath: 'topicService',
    baseQuery: createBaseQuery('topics'),
    tagTypes: ['Topics'],

    endpoints: (builder) => ({
        // all topics
        getTopics: builder.query<ITopicItem[], void>({
            query: () => ({
                url: '',
                method: 'GET',
            }),
            providesTags: ['Topics'],
        }),

        // root topics only
        getRootTopics: builder.query<ITopicItem[], void>({
            query: () => ({
                url: '?parent=null',
                method: 'GET',
            }),
            providesTags: ['Topics'],
        }),
    }),
});

export const {
    useGetTopicsQuery,
    useGetRootTopicsQuery,
} = topicService;
