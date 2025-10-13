import {createRoot} from 'react-dom/client'
import './index.css'
import App from './App.tsx'
import {Provider} from "react-redux";
import {store} from "./store";
import { GoogleReCaptchaProvider } from 'react-google-recaptcha-v3';
import {BrowserRouter} from "react-router";
import { APP_ENV } from './env/index.ts';
import {GoogleOAuthProvider} from "@react-oauth/google";
import React from 'react';
// import ReactDOM from 'react-dom/client';

createRoot(document.getElementById('root')!).render(
    <>
        <React.StrictMode>
            <Provider store={store}>
                <GoogleReCaptchaProvider reCaptchaKey={APP_ENV.RECAPTCHA_KEY}>
                    <BrowserRouter>
                        <GoogleOAuthProvider clientId="156685535196-s7n5vdbie6gbpmj1ilmuo4bls07082r9.apps.googleusercontent.com">
                            <App />
                        </GoogleOAuthProvider>
                    </BrowserRouter>
                </GoogleReCaptchaProvider>
            </Provider>
        </React.StrictMode>
    </>
)
