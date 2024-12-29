'use client'

import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import styles from '../GlobalStyle.module.scss';
import logo from '../../assets/logo.png';

const Login: React.FC = () => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const navigate = useNavigate();

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        try {
            // Giả sử có logic kiểm tra role ở đây
            const isAdmin = true; // Thay bằng logic thực tế
            
            if (isAdmin) {
                navigate('/dashboard', { replace: true });
            } else {
                navigate('/leadership', { replace: true });
            }
        } catch (error) {
            console.error('Login error:', error);
        }
    };

    return (
        <div className={styles.loginContainer}>
            <div className={styles.loginBox}>
                <div className={styles.loginHeader}>
                    <div className={styles.logoWrapper}>
                        <img src={logo} alt="Logo" className={styles.logo} />
                    </div>
                    <h1 className={styles.welcomeText}>Chào mừng trở lại!</h1>
                    <p className={styles.subText}>Đăng nhập để tiếp tục</p>
                </div>
                
                <form className={styles.loginForm} onSubmit={handleSubmit}>
                    <div className={styles.inputGroup}>
                        <div className={styles.inputWrapper}>
                            <i className={`${styles.icon} fas fa-envelope`}></i>
                            <input
                                type="email"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                placeholder="Email của bạn"
                                className={styles.input}
                                required
                            />
                        </div>
                    </div>

                    <div className={styles.inputGroup}>
                        <div className={styles.inputWrapper}>
                            <i className={`${styles.icon} fas fa-lock`}></i>
                            <input
                                type="password"
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                placeholder="Mật khẩu"
                                className={styles.input}
                                required
                            />
                        </div>
                    </div>

                    <div className={styles.forgotPassword}>
                        <a href="#" className={styles.forgotLink}>Quên mật khẩu?</a>
                    </div>

                    <button type="submit" className={styles.loginButton}>
                        Đăng nhập
                    </button>
                </form>
            </div>
        </div>
    );
};

export default Login;

