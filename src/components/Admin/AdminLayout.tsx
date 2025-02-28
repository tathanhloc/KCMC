import React from 'react';
import { Link, Outlet } from 'react-router-dom';
import Styles from './Admin.module.scss';

const AdminLayout = () => {
  return (
    <div className={Styles.adminContainer}>
      <nav className={Styles.adminNav}>
        <ul>
          <li>
            <Link to="/admin/slicks">Quản lý Slider</Link>
          </li>
          <li>
            <Link to="/admin/leadership">Quản lý Ban Chủ Nhiệm</Link>
          </li>
          <li>
            <Link to="/admin/activities">Quản lý Hoạt Động</Link>
          </li>
        </ul>
      </nav>
      <main className={Styles.adminContent}>
        <Outlet />
      </main>
    </div>
  );
};

export default AdminLayout; 