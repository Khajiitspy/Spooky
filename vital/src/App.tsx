import './App.css'
import UsersListPage from "./pages/users/UserListPage/";
import {Route, Routes} from "react-router";
import UserRegisterPage from "./pages/users/Register/";
import LoginPage from "./pages/users/Login/";
import ForgotPasswordPage from "./pages/users/ResetPasswordPage/ForgotPasswordPage.tsx";
import ResetPasswordPage from "./pages/users/ResetPasswordPage/ResetPasswordPage.tsx";
import SuccessPage from "./pages/users/ResetPasswordPage/SuccessPage.tsx";

function App() {

    return (
        <>
            <Routes>
                <Route path="/" >
                    <Route index element={<UsersListPage />}/>
                    <Route path={"register"} element={<UserRegisterPage />}/>
                    <Route path={"login"} element={<LoginPage />}/>
                    <Route path={"forgot-password"} element={<ForgotPasswordPage />} />
                    <Route path="reset-password/:uid/:token" element={<ResetPasswordPage />} />
                    <Route path={"success-confirm"} element={<SuccessPage />} />
                </Route>
            </Routes>

        </>
    )
}

export default App
