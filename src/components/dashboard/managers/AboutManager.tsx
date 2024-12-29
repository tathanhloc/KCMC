import React, { useState } from 'react';
import styles from '../Dashboard.module.scss';

interface AboutItem {
    id: number;
    title: string;
    description: string;
    icon: string;
}

const AboutManager: React.FC = () => {
    const [aboutItems, setAboutItems] = useState<AboutItem[]>([]);
    const [currentItem, setCurrentItem] = useState<AboutItem | null>(null);

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        // Add logic to save about item
    };

    return (
        <div className={styles.managerContainer}>
            <h2>Quản lý About Us</h2>
            
            <div className={styles.managerContent}>
                <div className={styles.formSection}>
                    <h3>Thêm/Sửa Thông tin</h3>
                    <form onSubmit={handleSubmit}>
                        <div className={styles.formGroup}>
                            <label>Tiêu đề</label>
                            <input 
                                type="text" 
                                value={currentItem?.title || ''} 
                                onChange={(e) => setCurrentItem(prev => 
                                    prev ? {...prev, title: e.target.value} : null
                                )}
                            />
                        </div>
                        <div className={styles.formGroup}>
                            <label>Mô tả</label>
                            <textarea 
                                value={currentItem?.description || ''} 
                                onChange={(e) => setCurrentItem(prev => 
                                    prev ? {...prev, description: e.target.value} : null
                                )}
                            />
                        </div>
                        <div className={styles.formGroup}>
                            <label>Icon (Font Awesome class)</label>
                            <input 
                                type="text"
                                value={currentItem?.icon || ''} 
                                onChange={(e) => setCurrentItem(prev => 
                                    prev ? {...prev, icon: e.target.value} : null
                                )}
                                placeholder="Ví dụ: fas fa-user"
                            />
                        </div>
                        <button type="submit" className={styles.submitButton}>
                            {currentItem ? 'Cập nhật' : 'Thêm mới'}
                        </button>
                    </form>
                </div>

                <div className={styles.listSection}>
                    <h3>Danh sách About Us</h3>
                    <div className={styles.aboutList}>
                        {aboutItems.map(item => (
                            <div key={item.id} className={styles.aboutItem}>
                                <i className={`${item.icon} ${styles.itemIcon}`}></i>
                                <div className={styles.itemInfo}>
                                    <h4>{item.title}</h4>
                                    <p>{item.description}</p>
                                </div>
                                <div className={styles.actions}>
                                    <button onClick={() => setCurrentItem(item)}>
                                        Sửa
                                    </button>
                                    <button onClick={() => {
                                        // Add delete logic
                                    }}>
                                        Xóa
                                    </button>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default AboutManager; 