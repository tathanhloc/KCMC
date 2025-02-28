import { FaRocket, FaEye, FaUsers } from 'react-icons/fa';
import Styles from '../components/GlobalStyle.module.scss'

export const MissionIcon = () => (
  <FaRocket className={Styles.AboutUsIcon} />
);

export const VisionIcon = () => (
  <FaEye className={Styles.AboutUsIcon}/>
);

export const ValuesIcon = () => (
  <FaUsers className={Styles.AboutUsIcon} />
);