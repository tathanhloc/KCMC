import React, { useState } from 'react';
import styles from '../Dashboard.module.scss';

interface NavItem {
    id: number;
    title: string;
    path: string;
    order: number;
}

const NavbarManager: React.FC = () => {
    const [navItems, setNavItems] = useState<NavItem[]>([]);
    const [currentItem, setCurrentItem] = useState<NavItem | null>(null);

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        // Add logic to save nav item
    };

    return (
        <div className={styles.managerContainer}>
            <h2>Quản lý Navbar</h2>
            
            <div className={styles.managerContent}>
                <div className={styles.formSection}>
                    <h3>Thêm/Sửa Menu</h3>
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
                            <label>Đường dẫn</label>
                            <input 
                                type="text" 
                                value={currentItem?.path || ''} 
                                onChange={(e) => setCurrentItem(prev => 
                                    prev ? {...prev, path: e.target.value} : null
                                )}
                            />
                        </div>
                        <div className={styles.formGroup}>
                            <label>Thứ tự</label>
                            <input 
                                type="number" 
                                value={currentItem?.order || ''} 
                                onChange={(e) => setCurrentItem(prev => 
                                    prev ? {...prev, order: parseInt(e.target.value)} : null
                                )}
                            />
                        </div>
                        <button type="submit" className={styles.submitButton}>
                            {currentItem ? 'Cập nhật' : 'Thêm mới'}
                        </button>
                    </form>
                </div>

                <div className={styles.listSection}>
                    <h3>Danh sách Menu</h3>
                    <div className={styles.navList}>
                        {navItems.sort((a, b) => a.order - b.order).map(item => (
                            <div key={item.id} className={styles.navItem}>
                                <div className={styles.navInfo}>
                                    <h4>{item.title}</h4>
                                    <p>{item.path}</p>
                                    <span>Thứ tự: {item.order}</span>
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

export default NavbarManager; 