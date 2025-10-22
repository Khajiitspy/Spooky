import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Layout, Menu } from 'antd';
import { useSelector, useDispatch } from 'react-redux';
import { type RootState } from '../../store';
import { clearTokens } from '../../store/authSlice';
import {
    LoginOutlined,
    LogoutOutlined,
    FormOutlined,
    UserOutlined,
    PlusOutlined,
} from '@ant-design/icons';

const { Header } = Layout;

const Navbar: React.FC = () => {
    const navigate = useNavigate();
    const dispatch = useDispatch();
    const access = useSelector((state: RootState) => state.auth.access);

    const handleLogout = () => {
        dispatch(clearTokens());
        navigate('/login');
    };

    return (
        <Header style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <div className="logo">
                <Link to="/" style={{ color: 'white', fontSize: 20, fontWeight: 'bold' }}>
                    🦇 DubiousBat
                </Link>
            </div>

            <Menu theme="dark" mode="horizontal">
                {!access ? (
                    <>
                        <Menu.Item key="login" icon={<LoginOutlined />}>
                            <Link to="/login">Увійти</Link>
                        </Menu.Item>
                        <Menu.Item key="register" icon={<FormOutlined />}>
                            <Link to="/register">Реєстрація</Link>
                        </Menu.Item>
                    </>
                ) : (
                    <>
                        <Menu.Item key="create-post" icon={<PlusOutlined />}>
                            <Link to="/create-post">+ Створити</Link>
                        </Menu.Item>
                        <Menu.Item key="profile" icon={<UserOutlined />}>
                            <Link to="/">Профіль</Link>
                        </Menu.Item>
                        <Menu.Item key="logout" icon={<LogoutOutlined />} onClick={handleLogout}>
                            Вийти
                        </Menu.Item>
                    </>
                )}
            </Menu>
        </Header>
    );
};

export default Navbar;
