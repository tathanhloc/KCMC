import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import styles from '../GlobalStyle.module.scss';
import logo from '../../assets/logo.png';
import { getAuth, signInWithEmailAndPassword, onAuthStateChanged } from 'firebase/auth';

const Login: React.FC = () => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState<string | null>(null);
    const [loading, setLoading] = useState(false);
    const navigate = useNavigate();
    const auth = getAuth();

    useEffect(() => {
        // Kiểm tra nếu người dùng đã đăng nhập
        const unsubscribe = onAuthStateChanged(auth, (user) => {
            if (user) {
                // Người dùng đã đăng nhập, chuyển hướng đến dashboard
                navigate('/dashboard', { replace: true });
            }
        });

        // Hủy đăng ký khi component unmount
        return () => unsubscribe();
    }, [auth, navigate]);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setError(null);
        setLoading(true);

        try {
            // Đăng nhập với email và mật khẩu
            await signInWithEmailAndPassword(auth, email, password);
            // Nếu thành công, useEffect sẽ bắt được sự thay đổi trạng thái và chuyển hướng
        } catch (error: any) {
            // Xử lý các lỗi Firebase auth
            if (error.code === 'auth/user-not-found' || error.code === 'auth/wrong-password') {
                setError('Email hoặc mật khẩu không chính xác');
            } else if (error.code === 'auth/invalid-email') {
                setError('Email không hợp lệ');
            } else if (error.code === 'auth/too-many-requests') {
                setError('Quá nhiều lần đăng nhập không thành công. Vui lòng thử lại sau');
            } else {
                setError('Đăng nhập không thành công. Vui lòng thử lại');
                console.error(error);
            }
        } finally {
            setLoading(false);
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
                
                {error && (
                    <div className={styles.errorMessage}>
                        <i className="fas fa-exclamation-circle"></i>
                        {error}
                    </div>
                )}
                
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
                                disabled={loading}
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
                                disabled={loading}
                            />
                        </div>
                    </div>

                    <div className={styles.forgotPassword}>
                        <a href="#" className={styles.forgotLink}>Quên mật khẩu?</a>
                    </div>

                    <button 
                        type="submit" 
                        className={styles.loginButton}
                        disabled={loading}
                    >
                        {loading ? (
                            <>
                                <i className="fas fa-spinner fa-spin"></i>
                                Đang đăng nhập...
                            </>
                        ) : 'Đăng nhập'}
                    </button>
                </form>
            </div>
        </div>
    );
};

export default Login;