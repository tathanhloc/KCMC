import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import { BrowserRouter as Router, Route, Routes, Navigate } from 'react-router-dom';
import HomePage from './pages/HomePage';
import Login from './components/login/Login';
import Dashboard from './components/dashboard/Dashboard';
import ErrorBoundary from './components/ErrorBoundary';
import { User } from './types/auth.types';
import './firebase';
import ThienNguyen from './components/ThienNguyen';

// Giả lập user data (sau này sẽ lấy từ context/redux store)
const mockUser: User = {
    id: 1,
    username: 'admin',
    email: 'kcmc@vnkgu.edu.vn',
    role: 'super_admin',
    fullName: 'Admin'
};

createRoot(document.getElementById('root')!).render(
    <StrictMode>
        <ErrorBoundary>
            <Router>
            <Routes>
                <Route path="/thiennguyen" element={<ThienNguyen />} />
                <Route path="/login" element={<Login />} />
                <Route path="/dashboard/*" element={<Dashboard userRole={mockUser.role} userId={mockUser.id} />} />
                <Route path="*" element={<Navigate to="/thiennguyen" replace />} /> 
            </Routes>

            </Router>
        </ErrorBoundary>
    </StrictMode>,
);