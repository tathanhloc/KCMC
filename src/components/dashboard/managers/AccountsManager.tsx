import React, { useState, useEffect } from 'react';
import styles from '../Dashboard.module.scss';
import { UserRole } from '../../../types/auth.types';

interface Account {
    id: number;
    email: string;
    fullName: string;
    studentId: string;
    role: 'member' | 'admin' | 'leader' | 'super_admin';
    status: 'active' | 'inactive';
    lastLogin?: string;
}

interface AccountsManagerProps {
    userRole: UserRole;
}

const AccountsManager: React.FC<AccountsManagerProps> = ({ userRole }) => {
    const [accounts, setAccounts] = useState<Account[]>([]);
    const [searchTerm, setSearchTerm] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [showResetConfirm, setShowResetConfirm] = useState(false);
    const [selectedAccount, setSelectedAccount] = useState<Account | null>(null);

    useEffect(() => {
        fetchAccounts();
    }, []);

    const fetchAccounts = async () => {
        setIsLoading(true);
        try {
            // API call sẽ được thêm sau
            const mockData: Account[] = [
                {
                    id: 1,
                    email: "20110001@vnkgu.edu.vn",
                    fullName: "Nguyễn Văn A",
                    studentId: "20110001",
                    role: "member",
                    status: "active",
                    lastLogin: "2024-03-20 10:30:00"
                },
                {
                    id: 2,
                    email: "20110002@vnkgu.edu.vn",
                    fullName: "Trần Thị B",
                    studentId: "20110002",
                    role: "member",
                    status: "active",
                    lastLogin: null
                }
            ];
            setAccounts(mockData);
        } catch (err) {
            setError('Không thể tải danh sách tài khoản');
            console.error(err);
        } finally {
            setIsLoading(false);
        }
    };

    const handleResetPassword = async (account: Account) => {
        setSelectedAccount(account);
        setShowResetConfirm(true);
    };

    const confirmResetPassword = async () => {
        if (!selectedAccount) return;
        setIsLoading(true);
        try {
            // Xác định mật khẩu mới dựa trên role
            const newPassword = selectedAccount.role === 'member' 
                ? selectedAccount.studentId  // Nếu là member thì dùng MSSV
                : 'Abc@kcmc2024';           // Các role khác dùng mật khẩu mặc định

            // API call sẽ được thêm sau
            // Gửi request reset password với newPassword
            
            // Hiển thị thông báo thành công
            alert(`Mật khẩu của tài khoản ${selectedAccount.email} đã được reset thành: ${newPassword}`);
            
            setShowResetConfirm(false);
            setSelectedAccount(null);
        } catch (err) {
            setError('Không thể reset mật khẩu');
            console.error(err);
        } finally {
            setIsLoading(false);
        }
    };

    const filteredAccounts = accounts.filter(account =>
        account.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
        account.fullName.toLowerCase().includes(searchTerm.toLowerCase()) ||
        account.studentId.toLowerCase().includes(searchTerm.toLowerCase())
    );

    return (
        <div className={styles.managerContainer}>
            <div className={styles.managerHeader}>
                <h2>Quản lý Tài khoản Thành viên</h2>
                <div className={styles.headerActions}>
                    <div className={styles.searchBox}>
                        <i className="fas fa-search"></i>
                        <input
                            type="text"
                            placeholder="Tìm kiếm theo email, tên, MSSV..."
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                        />
                    </div>
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
                            <th>MSSV</th>
                            <th>Họ và tên</th>
                            <th>Email</th>
                            <th>Vai trò</th>
                            <th>Trạng thái</th>
                            <th>Lần đăng nhập cuối</th>
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
                        ) : filteredAccounts.length === 0 ? (
                            <tr>
                                <td colSpan={8} className={styles.emptyState}>
                                    <i className="fas fa-user-slash"></i>
                                    <p>Không có tài khoản nào</p>
                                </td>
                            </tr>
                        ) : (
                            filteredAccounts.map((account, index) => (
                                <tr key={account.id}>
                                    <td>{index + 1}</td>
                                    <td>{account.studentId}</td>
                                    <td>{account.fullName}</td>
                                    <td>{account.email}</td>
                                    <td>
                                        <span className={`${styles.role} ${styles[account.role]}`}>
                                            {account.role === 'member' ? 'Thành viên' : 
                                             account.role === 'leader' ? 'Ban chủ nhiệm' : 
                                             account.role === 'admin' ? 'Admin' : 'Super Admin'}
                                        </span>
                                    </td>
                                    <td>
                                        <span className={`${styles.status} ${styles[account.status]}`}>
                                            {account.status === 'active' ? 'Đang hoạt động' : 'Ngừng hoạt động'}
                                        </span>
                                    </td>
                                    <td>
                                        {account.lastLogin ? 
                                            new Date(account.lastLogin).toLocaleString('vi-VN') : 
                                            'Chưa đăng nhập'}
                                    </td>
                                    <td>
                                        <div className={styles.actions}>
                                            <button 
                                                onClick={() => handleResetPassword(account)}
                                                className={styles.resetButton}
                                                title="Reset mật khẩu"
                                            >
                                                <i className="fas fa-key"></i>
                                                Reset mật khẩu
                                            </button>
                                        </div>
                                    </td>
                                </tr>
                            ))
                        )}
                    </tbody>
                </table>
            </div>

            {showResetConfirm && (
                <div className={styles.modal}>
                    <div className={styles.modalContent}>
                        <div className={styles.modalHeader}>
                            <h3>Xác nhận reset mật khẩu</h3>
                            <button 
                                className={styles.closeButton}
                                onClick={() => {
                                    setShowResetConfirm(false);
                                    setSelectedAccount(null);
                                }}
                            >
                                <i className="fas fa-times"></i>
                            </button>
                        </div>
                        <div className={styles.modalBody}>
                            <p>Bạn có chắc chắn muốn reset mật khẩu cho tài khoản:</p>
                            <p><strong>{selectedAccount?.email}</strong>?</p>
                            <p className={styles.note}>
                                <i className="fas fa-info-circle"></i>
                                Mật khẩu mới sẽ được tạo tự động và gửi đến email của thành viên
                            </p>
                        </div>
                        <div className={styles.modalActions}>
                            <button
                                onClick={confirmResetPassword}
                                className={styles.submitButton}
                                disabled={isLoading}
                            >
                                {isLoading ? (
                                    <i className="fas fa-spinner fa-spin"></i>
                                ) : (
                                    <i className="fas fa-key"></i>
                                )}
                                Xác nhận reset
                            </button>
                            <button
                                onClick={() => {
                                    setShowResetConfirm(false);
                                    setSelectedAccount(null);
                                }}
                                className={styles.cancelButton}
                            >
                                <i className="fas fa-times"></i>
                                Hủy
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default AccountsManager; 