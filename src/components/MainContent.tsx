import React from 'react';
import styles from '../components/GlobalStyle.module.scss';

const MainContent: React.FC = () => {
    return (
        <main>
            {/* Slider Section */}
            <section className={styles.SliderContainer}>
                <div className={styles.wrapperSlider}>
                    <h1 className={styles.SliderTitle}>Câu lạc bộ Kỹ năng mềm</h1>
                    <p className={styles.SliderDescribe}>
                        Nơi phát triển kỹ năng và tạo dựng tương lai
                    </p>
                    <img src="/slider-bg.jpg" alt="Background" className={styles.SlideImg} />
                </div>
            </section>

            {/* About Us Section */}
            <section className={styles.AboutUsContainer}>
                <h1 className={styles.AboutUsTitle}>Về chúng tôi</h1>
                <div className={styles.AboutUsCompWrapper}>
                    {/* Add About Us content */}
                </div>
            </section>

            {/* Activities Section */}
            <section>
                <h1 className={styles.ActivityTitle}>Hoạt động nổi bật</h1>
                <div className={styles.ActivitiesContainer}>
                    {/* Add Activities content */}
                </div>
            </section>
        </main>
    );
};

export default MainContent; 