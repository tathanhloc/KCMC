import React, { useState } from 'react';
import styles from './Dashboard.module.scss';
import SliderManager from './managers/SliderManager';
import AboutManager from './managers/AboutManager';
import LeadershipManager from './managers/LeadershipManager';
import NavbarManager from './managers/NavbarManager';
import OverviewManager from './managers/OverviewManager';
import ProfileManager from './managers/ProfileManager';
import PasswordManager from './managers/PasswordManager';
import MembersManager from './managers/MembersManager';
import AccountsManager from './managers/AccountsManager';
import DepartmentsManager from './managers/DepartmentsManager';
import ActivitiesManager from './managers/ActivitiesManager';
import { UserRole } from '../../types/auth.types';

interface DashboardProps {
    userRole: UserRole;
    userId: number;
}

const Dashboard: React.FC<DashboardProps> = ({ userRole, userId }) => {
    const [currentView, setCurrentView] = useState('overview');

    // Xác định các menu items dựa trên role
    const getMenuItems = () => {
        const commonItems = [
            {
                id: 'overview',
                icon: 'fas fa-home',
                label: 'Tổng quan',
                component: <OverviewManager userRole={userRole} />
            },
            {
                id: 'slider',
                icon: 'fas fa-images',
                label: 'Quản lý Slider',
                component: <SliderManager userRole={userRole} />
            },
            {
                id: 'about',
                icon: 'fas fa-info-circle',
                label: 'Quản lý About Us',
                component: <AboutManager userRole={userRole} />
            },
            {
                id: 'leadership',
                icon: 'fas fa-users',
                label: 'Quản lý Leadership',
                component: <LeadershipManager userRole={userRole} />
            },
            {
                id: 'members',
                icon: 'fas fa-user-friends',
                label: 'Quản lý Thành viên',
                component: <MembersManager userRole={userRole} />
            },
            {
                id: 'departments',
                icon: 'fas fa-building',
                label: 'Quản lý Ban',
                component: <DepartmentsManager userRole={userRole} />
            },
            {
                id: 'activities',
                icon: 'fas fa-calendar-alt',
                label: 'Quản lý Hoạt động',
                component: <ActivitiesManager userRole={userRole} />
            },
            {
                id: 'password',
                icon: 'fas fa-key',
                label: 'Đổi mật khẩu',
                component: <PasswordManager userRole={userRole} />
            }
        ];

        // Các items chỉ dành cho admin
        const adminOnlyItems = [
            {
                id: 'navbar',
                icon: 'fas fa-bars',
                label: 'Quản lý Navbar',
                component: <NavbarManager />
            },
            {
                id: 'accounts',
                icon: 'fas fa-user-shield',
                label: 'Quản lý Tài khoản',
                component: <AccountsManager />
            }
        ];

        // Items cho leader và admin (không phải super_admin)
        const profileItem = {
            id: 'profile',
            icon: 'fas fa-user-circle',
            label: 'Thông tin cá nhân',
            component: <ProfileManager userRole={userRole} />
        };

        let items = [...commonItems];

        if (userRole === 'super_admin') {
            items = [...items, ...adminOnlyItems];
        } else if (userRole === 'admin') {
            items = [...items, ...adminOnlyItems, profileItem];
        } else {
            items = [...items, profileItem];
        }

        return items;
    };

    const menuItems = getMenuItems();
    const currentItem = menuItems.find(item => item.id === currentView);

    return (
        <div className={styles.dashboardContainer}>
            <div className={styles.sidebar}>
                <div className={styles.logoSection}>
                    <h2>{userRole === 'leader' ? 'Ban Chủ Nhiệm' : 'Admin Dashboard'}</h2>
                </div>
                <nav className={styles.navigation}>
                    <ul>
                        {menuItems.map(item => (
                            <li key={item.id}>
                                <button 
                                    className={currentView === item.id ? styles.active : ''} 
                                    onClick={() => setCurrentView(item.id)}
                                >
                                    <i className={item.icon}></i>
                                    <span>{item.label}</span>
                                </button>
                            </li>
                        ))}
                    </ul>
                </nav>
            </div>
            <div className={styles.mainContent}>
                <header className={styles.header}>
                    <div className={styles.searchBar}>
                        <i className="fas fa-search"></i>
                        <input type="search" placeholder="Tìm kiếm..." />
                    </div>
                    <div className={styles.userSection}>
                        <span>{userRole.charAt(0).toUpperCase() + userRole.slice(1)}</span>
                        <button className={styles.logoutButton}>
                            <i className="fas fa-sign-out-alt"></i>
                            <span>Đăng xuất</span>
                        </button>
                    </div>
                </header>
                <main className={styles.content}>
                    {currentItem?.component || (
                        <div className={styles.overview}>
                            <h1>Chào mừng đến với trang quản trị</h1>
                            <p>Vui lòng chọn mục cần quản lý từ menu bên trái</p>
                        </div>
                    )}
                </main>
            </div>
        </div>
    );
};

export default Dashboard; 