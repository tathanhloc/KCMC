import React, { useState, useEffect } from 'react';
import styles from '../Dashboard.module.scss';
import { UserRole } from '../../../types/auth.types';

interface Activity {
    id: number;
    title: string;
    description: string;
    location: string;
    startDate: string;
    endDate: string;
    status: 'upcoming' | 'ongoing' | 'completed' | 'cancelled';
}

interface ActivitiesManagerProps {
    userRole: UserRole;
}

const ActivitiesManager: React.FC<ActivitiesManagerProps> = ({ userRole }) => {
    const [activities, setActivities] = useState<Activity[]>([]);
    const [searchTerm, setSearchTerm] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [showModal, setShowModal] = useState(false);
    const [currentActivity, setCurrentActivity] = useState<Activity | null>(null);

    useEffect(() => {
        fetchActivities();
    }, []);

    const fetchActivities = async () => {
        setIsLoading(true);
        try {
            // API call sẽ được thêm sau
            const mockData: Activity[] = [
                {
                    id: 1,
                    title: "Hội thảo chuyên đề",
                    description: "Tổ chức các buổi hội thảo với chuyên gia trong ngành",
                    location: "Hội trường A",
                    startDate: "2024-04-01T09:00:00",
                    endDate: "2024-04-01T12:00:00",
                    status: "upcoming"
                },
                // Thêm data mẫu khác...
            ];
            setActivities(mockData);
        } catch (err) {
            setError('Không thể tải danh sách hoạt động');
            console.error(err);
        } finally {
            setIsLoading(false);
        }
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsLoading(true);
        try {
            if (currentActivity) {
                // Update existing activity
                const updatedActivities = activities.map(activity =>
                    activity.id === currentActivity.id ? currentActivity : activity
                );
                setActivities(updatedActivities);
            } else {
                // Add new activity
                const newActivity: Activity = {
                    id: activities.length + 1,
                    title: '',
                    description: '',
                    location: '',
                    startDate: '',
                    endDate: '',
                    status: 'upcoming'
                };
                setActivities([...activities, newActivity]);
            }
            resetForm();
            setShowModal(false);
        } catch (err) {
            setError('Có lỗi xảy ra khi lưu thông tin');
            console.error(err);
        } finally {
            setIsLoading(false);
        }
    };

    const resetForm = () => {
        setCurrentActivity(null);
        setShowModal(false);
    };

    const filteredActivities = activities.filter(activity =>
        activity.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        activity.location.toLowerCase().includes(searchTerm.toLowerCase())
    );

    return (
        <div className={styles.managerContainer}>
            <div className={styles.managerHeader}>
                <h2>Quản lý Hoạt động</h2>
                <div className={styles.headerActions}>
                    <div className={styles.searchBox}>
                        <i className="fas fa-search"></i>
                        <input
                            type="text"
                            placeholder="Tìm kiếm theo tên hoạt động, địa điểm..."
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                        />
                    </div>
                    <button 
                        className={styles.addButton}
                        onClick={() => setShowModal(true)}
                    >
                        <i className="fas fa-plus"></i>
                        Thêm hoạt động
                    </button>
                </div>
            </div>

            {error && (
                <div className={styles.errorMessage}>
                    <i className="fas fa-exclamation-circle"></i>
                    {error}
                </div>
            )}

            <div className={styles.tableContainer}>
                <table className={styles.membersTable}>
                    <thead>
                        <tr>
                            <th>STT</th>
                            <th>Tên hoạt động</th>
                            <th>Mô tả</th>
                            <th>Địa điểm</th>
                            <th>Thời gian bắt đầu</th>
                            <th>Thời gian kết thúc</th>
                            <th>Trạng thái</th>
                            <th>Hoạt động</th>
                        </tr>
                    </thead>
                    <tbody>
                        {isLoading ? (
                            <tr>
                                <td colSpan={8} className={styles.loading}>
                                    <i className="fas fa-spinner fa-spin"></i>
                                    Đang tải...
                                </td>
                            </tr>
                        ) : filteredActivities.length === 0 ? (
                            <tr>
                                <td colSpan={8} className={styles.emptyState}>
                                    <i className="fas fa-user-slash"></i>
                                    <p>Không có hoạt động nào</p>
                                </td>
                            </tr>
                        ) : (
                            filteredActivities.map((activity, index) => (
                                <tr key={activity.id}>
                                    <td>{index + 1}</td>
                                    <td>{activity.title}</td>
                                    <td>{activity.description}</td>
                                    <td>{activity.location}</td>
                                    <td>{new Date(activity.startDate).toLocaleString('vi-VN')}</td>
                                    <td>{new Date(activity.endDate).toLocaleString('vi-VN')}</td>
                                    <td>
                                        <span className={`${styles.status} ${styles[activity.status]}`}>
                                            {activity.status === 'upcoming' ? 'Sắp diễn ra' : 
                                             activity.status === 'ongoing' ? 'Đang diễn ra' : 
                                             activity.status === 'completed' ? 'Đã hoàn thành' : 'Đã hủy'}
                                        </span>
                                    </td>
                                    <td>
                                        <div className={styles.actions}>
                                            <button 
                                                onClick={() => {
                                                    setCurrentActivity(activity);
                                                    setShowModal(true);
                                                }}
                                                className={styles.editButton}
                                                title="Sửa"
                                            >
                                                <i className="fas fa-edit"></i>
                                                Sửa
                                            </button>
                                            <button 
                                                onClick={() => {
                                                    if (window.confirm('Bạn có chắc chắn muốn xóa hoạt động này?')) {
                                                        setActivities(activities.filter(a => a.id !== activity.id));
                                                    }
                                                }}
                                                className={styles.deleteButton}
                                                title="Xóa"
                                            >
                                                <i className="fas fa-trash"></i>
                                                Xóa
                                            </button>
                                        </div>
                                    </td>
                                </tr>
                            ))
                        )}
                    </tbody>
                </table>
            </div>

            {showModal && (
                <div className={styles.modal}>
                    <div className={styles.modalContent}>
                        <div className={styles.modalHeader}>
                            <h3>{currentActivity ? 'Sửa thông tin hoạt động' : 'Thêm hoạt động mới'}</h3>
                            <button 
                                className={styles.closeButton}
                                onClick={resetForm}
                            >
                                <i className="fas fa-times"></i>
                            </button>
                        </div>
                        <form onSubmit={handleSubmit}>
                            <div className={styles.formGroup}>
                                <label>Tên hoạt động</label>
                                <input 
                                    type="text" 
                                    value={currentActivity?.title || ''} 
                                    onChange={(e) => setCurrentActivity(prev => 
                                        prev ? {...prev, title: e.target.value} : null
                                    )}
                                    required
                                />
                            </div>

                            <div className={styles.formGroup}>
                                <label>Mô tả</label>
                                <textarea 
                                    value={currentActivity?.description || ''} 
                                    onChange={(e) => setCurrentActivity(prev => 
                                        prev ? {...prev, description: e.target.value} : null
                                    )}
                                    rows={4}
                                    required
                                />
                            </div>

                            <div className={styles.formGroup}>
                                <label>Địa điểm</label>
                                <input 
                                    type="text" 
                                    value={currentActivity?.location || ''} 
                                    onChange={(e) => setCurrentActivity(prev => 
                                        prev ? {...prev, location: e.target.value} : null
                                    )}
                                    required
                                />
                            </div>

                            <div className={styles.formGroup}>
                                <label>Thời gian bắt đầu</label>
                                <input 
                                    type="datetime-local" 
                                    value={currentActivity?.startDate || ''} 
                                    onChange={(e) => setCurrentActivity(prev => 
                                        prev ? {...prev, startDate: e.target.value} : null
                                    )}
                                    required
                                />
                            </div>

                            <div className={styles.formGroup}>
                                <label>Thời gian kết thúc</label>
                                <input 
                                    type="datetime-local" 
                                    value={currentActivity?.endDate || ''} 
                                    onChange={(e) => setCurrentActivity(prev => 
                                        prev ? {...prev, endDate: e.target.value} : null
                                    )}
                                    required
                                />
                            </div>

                            <div className={styles.formGroup}>
                                <label>Trạng thái</label>
                                <select
                                    value={currentActivity?.status || 'upcoming'}
                                    onChange={(e) => setCurrentActivity(prev => 
                                        prev ? {...prev, status: e.target.value as 'upcoming' | 'ongoing' | 'completed' | 'cancelled'} : null
                                    )}
                                >
                                    <option value="upcoming">Sắp diễn ra</option>
                                    <option value="ongoing">Đang diễn ra</option>
                                    <option value="completed">Đã hoàn thành</option>
                                    <option value="cancelled">Đã hủy</option>
                                </select>
                            </div>

                            <div className={styles.modalActions}>
                                <button
                                    type="submit"
                                    className={styles.submitButton}
                                    disabled={isLoading}
                                >
                                    {isLoading ? (
                                        <i className="fas fa-spinner fa-spin"></i>
                                    ) : (
                                        <i className={`fas fa-${currentActivity ? 'save' : 'plus'}`}></i>
                                    )}
                                    {currentActivity ? 'Cập nhật' : 'Thêm mới'}
                                </button>
                                <button
                                    type="button"
                                    className={styles.cancelButton}
                                    onClick={resetForm}
                                >
                                    <i className="fas fa-times"></i>
                                    Hủy
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </div>
    );
};

export default ActivitiesManager; 