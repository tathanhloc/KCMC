import { Link } from 'react-router-dom';
import Styles from '../components/GlobalStyle.module.scss';

export default function NavBar({ logo }: { logo: string }) {
    return (
        <div className={Styles.NavBar}>
            <div className={Styles.LogoWrapper}>
                <img src={logo} alt="LogoOfClb" className={Styles.Logo} />
                <h1 className={Styles.CLBName}>
                    Hội sinh viên trường Đại học Kiên Giang <br />
                    Câu lạc bộ Truyền Thông Và Máy Tính
                </h1>
            </div>
            <ul className={Styles.IndexWrapper}>
                <li className={Styles.IndexLink}>
                    <a href="#">Giới Thiệu</a>
                </li>
                <li className={Styles.IndexLink}>
                    <a href="#">Hoạt Động</a>
                </li>
                <li className={Styles.IndexLink}>
                    <Link to="/login">Đăng Nhập / Đăng Kí</Link>
                </li>
            </ul>
        </div>
    );
}