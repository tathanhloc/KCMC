import Styles from '../components/GlobalStyle.module.scss'
import LeaderCard from './LeaderCard';
export default function LeaderShip(){

    return(<>
       <div className={Styles.LeaderShip}>
        <h1>Ban chủ nhiệm</h1>
        </div>
        <div className={Styles.LeaderCardContainer}>
            
        <LeaderCard/>
        </div>
        </>
        
       
       
    );
}