import AboutUsComp from '../components/AboutUsComp.tsx'
import LinkBtn from './LinkBtn.tsx';
import Styles from './GlobalStyle.module.scss'
import {MissionIcon,VisionIcon,ValuesIcon } from '../components/icon.tsx'

export default function AboutUS()
{
    return(
        <div className={Styles.AboutUsContainer}>
            <h1 className={Styles.AboutUsTitle}>Về Chúng Tôi</h1>
            <div className={Styles.AboutUsCompWrapper}>
                
                <AboutUsComp
                    title="Sứ mệnh"
                    describe=
                    "Câu lạc bộ chúng tôi cam kết tạo ra một môi trường học tập và phát triển bản thân cho tất cả các thành viên, thông qua các hoạt động đa dạng và sáng tạo."
                    icon={<MissionIcon/>}/>
                    
                <AboutUsComp
                    title="Tầm nhìn"
                    describe="Chúng tôi hướng tới việc trở thành một trong những câu lạc bộ hàng đầu, nơi các thành viên có thể phát triển kỹ năng, xây dựng mạng lưới và tạo ra những đóng góp tích cực cho cộng đồng."
                    icon={<VisionIcon/>}/>

                <AboutUsComp
                    title="Giá trị cốt lõi"
                    describe="Chúng tôi hướng tới việc trở thành một trong những câu lạc bộ hàng đầu, nơi các thành viên có thể phát triển kỹ năng, xây dựng mạng lưới và tạo ra những đóng góp tích cực cho cộng đồng."
                    icon={<ValuesIcon/>}/>
                    </div>
                
            
            <LinkBtn label="Tham gia cùng chúng tôi" link="#" />
        </div>  
    );
}