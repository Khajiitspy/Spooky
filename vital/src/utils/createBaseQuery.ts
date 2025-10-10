import { fetchBaseQuery } from "@reduxjs/toolkit/query";
import { APP_ENV } from "../env";
import type { RootState } from "../store";

const PUBLIC_ENDPOINTS = [
  'login/',
  'register/',
  'password-reset-request/',
  'password-reset-confirm/',
  'generate/',
];

export const createBaseQuery = (apiPrefix: string) => {
  const baseUrl = apiPrefix
    ? `${APP_ENV.API_BASE_URL}/api/${apiPrefix}/`
    : `${APP_ENV.API_BASE_URL}/api/`;

  return fetchBaseQuery({
    baseUrl,
    prepareHeaders: (headers, { getState, endpoint }) => {
      const token = (getState() as RootState).auth.access;

      // Skip attaching token to public endpoints
      const skipAuth = PUBLIC_ENDPOINTS.some((publicUrl) =>
        endpoint.endsWith(publicUrl.replace('/', '')) // RTK endpoint name === builder key
      );

      if (!skipAuth && token) {
        headers.set("Authorization", `Bearer ${token}`);
      }

      return headers;
    },
  });
};
