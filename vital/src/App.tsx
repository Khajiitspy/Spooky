import './App.css'
import { Route, Routes } from 'react-router';
import { Layout } from 'antd';

import Navbar from './components/layout/Navbar';

import UsersListPage from './pages/users/UserListPage/';
import UserRegisterPage from './pages/users/Register/';
import LoginPage from './pages/users/Login/';
import ForgotPasswordPage from './pages/users/ResetPasswordPage/ForgotPasswordPage.tsx';
import ResetPasswordPage from './pages/users/ResetPasswordPage/ResetPasswordPage.tsx';
import SuccessPage from './pages/users/ResetPasswordPage/SuccessPage.tsx';
import TopicsListPage from './pages/topics/TopicListPage/index.tsx'; 

const { Content } = Layout;

function App() {
    return (
        <Layout style={{ minHeight: '100vh' }}>
            <Navbar />

            <Content style={{ padding: '24px' }}>
                <Routes>
                    <Route path="/" element={<UsersListPage />} />
                    <Route path="/topics" element={<TopicsListPage />} />
                    <Route path="/register" element={<UserRegisterPage />} />
                    <Route path="/login" element={<LoginPage />} />
                    <Route path="/forgot-password" element={<ForgotPasswordPage />} />
                    <Route path="/reset-password/:uid/:token" element={<ResetPasswordPage />} />
                    <Route path="/success-confirm" element={<SuccessPage />} />
                </Routes>
            </Content>
        </Layout>
    );
}

export default App;
