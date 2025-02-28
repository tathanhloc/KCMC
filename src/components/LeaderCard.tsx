
import Styles from '../components/GlobalStyle.module.scss';
import {LeaderShipData} from '../components/LeaderShipData.tsx';
interface leadercard{
img: string;
name: string;
role: string;
describe: string;
};
export default function LeaderCard(){
    const ListLeader = LeaderShipData.map((leader : leadercard ) =>
 <div className={Styles.LeaderCard}>
         <div>
             <img className={Styles.LeaderImg} src={leader.img} alt="AvatarOfLeader" />
             <h2>{leader.name}</h2>
             <p>{leader.role}</p>
             <p>{leader.describe}</p>
         </div>
         </div>
       


)
    return(
       <div className={Styles.LeaderCardWrapper}>{ListLeader}</div>
    )

}