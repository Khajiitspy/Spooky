import './App.css'
import UsersListPage from "./pages/users/UserListPage/";
import {Route, Routes} from "react-router";
import UserRegisterPage from "./pages/users/Register/";
import LoginPage from "./pages/users/Login/";


function App() {

    return (
        <>
            <Routes>
                <Route path="/" >
                    <Route index element={<UsersListPage />}/>
                    <Route path={"register"} element={<UserRegisterPage />}/>
                    <Route path={"login"} element={<LoginPage />}/>
                </Route>
            </Routes>

        </>
    )
}

export default App
