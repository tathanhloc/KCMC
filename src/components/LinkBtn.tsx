import Styles from '../components/GlobalStyle.module.scss';

interface Props {
    link: string;
    label: string;
}

const LinkBtn: React.FC<Props> = ({ link, label }) => {
    return (
        <div >
            <a href={link}>
            <button className={Styles.LinkBtnContainer}>
                <h2>{label}</h2>
            </button>
            </a>
        </div>
    );
};

export default LinkBtn; 
