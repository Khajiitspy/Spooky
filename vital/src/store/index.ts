import {configureStore} from "@reduxjs/toolkit";
import {type TypedUseSelectorHook, useDispatch, useSelector} from "react-redux";
import {userService} from "../services/userService";
import authSlice from "./authSlice";
import {topicService} from "../services/topicService";
import { postService } from "../services/postService";

export const store = configureStore({
    reducer: {
        [topicService.reducerPath]: topicService.reducer,
        [userService.reducerPath]: userService.reducer,
        [postService.reducerPath]: postService.reducer,
        auth: authSlice,
    },
    middleware: (getDefaultMiddleware) => getDefaultMiddleware()
        .concat(userService.middleware, topicService.middleware, postService.middleware),
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;

export const useAppDispatch = () => useDispatch<AppDispatch>();
export const useAppSelector: TypedUseSelectorHook<RootState> = useSelector;
