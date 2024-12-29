import Styles from '../components/GlobalStyle.module.scss';
import {ActivitiesData} from '../components/ActivitiesData';
interface activity{
    title: string;
    describe: string;
}
export default function Activities () {
    const ListActivities = ActivitiesData.map((Activity: activity) =>
        <div className={Styles.ActivityWrapper}>
            <h2>{Activity.title}</h2>
                <p>{Activity.describe}</p>
        </div>
    )
    return(
        <>
        <h1 className={Styles.ActivityTitle}>Hoạt Động Của Chúng Tôi</h1>
        <div className={Styles.ActivitiesContainer}>{ListActivities}</div>
        </>
    );
}
