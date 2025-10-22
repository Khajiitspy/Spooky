import './App.css'
import { Route, Routes } from 'react-router';

import UsersListPage from './pages/users/UserListPage/';
import UserRegisterPage from './pages/users/Register/';
import LoginPage from './pages/users/Login/';
import ForgotPasswordPage from './pages/users/ResetPasswordPage/ForgotPasswordPage.tsx';
import ResetPasswordPage from './pages/users/ResetPasswordPage/ResetPasswordPage.tsx';
import SuccessPage from './pages/users/ResetPasswordPage/SuccessPage.tsx';
import TopicsListPage from './pages/topics/TopicListPage/index.tsx'; 
import UserLayout from './layout/UserLayout.tsx'; 
import NotFoundPage from './pages/additional/NotFoundPage.tsx'; 
import CreatePostPage from './pages/posts/CreatePostPage/index.tsx';

function App() {
    return (
        <Routes>
            <Route path="/" element={<UserLayout />}>
                <Route index element={<UsersListPage />}/>
                <Route path="/topics" element={<TopicsListPage />} />
                <Route path="/register" element={<UserRegisterPage />} />
                <Route path="/login" element={<LoginPage />} />
                <Route path="/forgot-password" element={<ForgotPasswordPage />} />
                <Route path="/reset-password/:uid/:token" element={<ResetPasswordPage />} />
                <Route path="/success-confirm" element={<SuccessPage />} />
                <Route path="/create-post" element={<CreatePostPage/>} />
            </Route>
            <Route path="*" element={<NotFoundPage/>} />
        </Routes>
    );
}

export default App;
