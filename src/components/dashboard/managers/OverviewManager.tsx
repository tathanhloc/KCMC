import React from 'react';
import styles from '../Dashboard.module.scss';

interface StatisticProps {
    icon: string;
    title: string;
    value: number;
    trend?: number;
    color: string;
}

const StatisticCard: React.FC<StatisticProps> = ({ icon, title, value, trend, color }) => (
    <div className={styles.statisticCard}>
        <div className={styles.iconWrapper} style={{ backgroundColor: `${color}15` }}>
            <i className={`${icon} ${styles.icon}`} style={{ color: color }}></i>
        </div>
        <div className={styles.statisticInfo}>
            <h3>{title}</h3>
            <div className={styles.valueWrapper}>
                <span className={styles.value}>{value.toLocaleString()}</span>
                {trend && (
                    <span className={`${styles.trend} ${trend > 0 ? styles.positive : styles.negative}`}>
                        <i className={`fas fa-arrow-${trend > 0 ? 'up' : 'down'}`}></i>
                        {Math.abs(trend)}%
                    </span>
                )}
            </div>
        </div>
    </div>
);

const OverviewManager: React.FC = () => {
    // Giả lập dữ liệu thống kê
    const statistics = [
        {
            icon: 'fas fa-eye',
            title: 'Lượt truy cập',
            value: 15234,
            trend: 12.5,
            color: '#3b82f6'
        },
        {
            icon: 'fas fa-users',
            title: 'Thành viên',
            value: 324,
            trend: 8.2,
            color: '#10b981'
        },
        {
            icon: 'fas fa-user-tie',
            title: 'Ban chủ nhiệm',
            value: 12,
            color: '#8b5cf6'
        }
    ];

    return (
        <div className={styles.overviewContainer}>
            <div className={styles.statisticsGrid}>
                {statistics.map((stat, index) => (
                    <StatisticCard key={index} {...stat} />
                ))}
            </div>

            <div className={styles.chartsSection}>
                <div className={styles.chartCard}>
                    <h3>Thống kê truy cập</h3>
                    <div className={styles.chartPlaceholder}>
                        {/* Thêm biểu đồ thống kê ở đây */}
                        <p>Biểu đồ thống kê truy cập theo thời gian</p>
                    </div>
                </div>

                <div className={styles.recentActivities}>
                    <h3>Hoạt động gần đây</h3>
                    <div className={styles.activityList}>
                        <div className={styles.activityItem}>
                            <i className="fas fa-user-plus"></i>
                            <div className={styles.activityInfo}>
                                <p>Thêm mới thành viên: Nguyễn Văn A</p>
                                <span>2 giờ trước</span>
                            </div>
                        </div>
                        <div className={styles.activityItem}>
                            <i className="fas fa-edit"></i>
                            <div className={styles.activityInfo}>
                                <p>Cập nhật thông tin Slider</p>
                                <span>5 giờ trước</span>
                            </div>
                        </div>
                        {/* Thêm các hoạt động khác */}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default OverviewManager; 