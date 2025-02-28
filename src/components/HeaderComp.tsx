import React from 'react';
import { Link } from 'react-router-dom';
import styles from '../components/GlobalStyle.module.scss';

const HeaderComp: React.FC = () => {
    return (
        <div className={styles.NavBar}>
            <div className={styles.LogoWrapper}>
                <img src="/logo.png" alt="Logo" className={styles.Logo} />
                <div className={styles.CLBName}>
                    <p>CLB Kỹ năng mềm</p>
                    <p>Trường Đại học Sư phạm Kỹ thuật TP.HCM</p>
                </div>
            </div>
            <div className={styles.IndexWrapper}>
                <ul>
                    <li className={styles.IndexLink}>
                        <Link to="/">Trang chủ</Link>
                    </li>
                    <li className={styles.IndexLink}>
                        <Link to="/about">Về chúng tôi</Link>
                    </li>
                    <li className={styles.IndexLink}>
                        <Link to="/activities">Hoạt động</Link>
                    </li>
                    <li className={styles.IndexLink}>
                        <Link to="/contact">Liên hệ</Link>
                    </li>
                </ul>
            </div>
            <Link to="/login" className={styles.LinkBtnContainer}>
                Đăng nhập
            </Link>
        </div>
    );
};

export default HeaderComp; 