import {fetchBaseQuery} from "@reduxjs/toolkit/query";
import {APP_ENV} from "../env";
import type { RootState } from "../store";

// export const createBaseQuery = (endpoint: string) =>
//     fetchBaseQuery({
//         baseUrl: `${APP_ENV.API_BASE_URL}/api/${endpoint}/`,
//     });
export const createBaseQuery = (apiPrefix: string) => {
  const baseUrl = apiPrefix
    ? `${APP_ENV.API_BASE_URL}/api/${apiPrefix}/`
    : `${APP_ENV.API_BASE_URL}/api/`;

  return fetchBaseQuery({
    baseUrl,
    prepareHeaders: (headers, { getState }) => {
      const token = (getState() as RootState).auth.access;
      if (token) {
        headers.set('Authorization', `Bearer ${token}`);
      }
      return headers;
    },
  });
};

