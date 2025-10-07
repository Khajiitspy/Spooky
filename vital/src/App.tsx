import './App.css'
import UsersListPage from "./pages/users/UserListPage/";
import {Route, Routes} from "react-router";
import UserRegisterPage from "./pages/users/Register/";


function App() {

    return (
        <>
            <Routes>
                <Route path="/" >
                    <Route index element={<UsersListPage />}/>
                    <Route path={"register"} element={<UserRegisterPage />}/>
                </Route>
            </Routes>

        </>
    )
}

export default App
