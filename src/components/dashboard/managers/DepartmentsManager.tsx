import React, { useState, useEffect } from 'react';
import styles from '../Dashboard.module.scss';
import { UserRole } from '../../../types/auth.types';

interface Department {
    id: number;
    name: string;
    description: string;
    leaderName: string;
    status: 'active' | 'inactive';
}

interface DepartmentsManagerProps {
    userRole: UserRole;
}

const DepartmentsManager: React.FC<DepartmentsManagerProps> = ({ userRole }) => {
    const [departments, setDepartments] = useState<Department[]>([]);
    const [searchTerm, setSearchTerm] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [showModal, setShowModal] = useState(false);
    const [currentDepartment, setCurrentDepartment] = useState<Department | null>(null);

    useEffect(() => {
        fetchDepartments();
    }, []);

    const fetchDepartments = async () => {
        setIsLoading(true);
        try {
            // API call sẽ được thêm sau
            const mockData: Department[] = [
                {
                    id: 1,
                    name: "Ban Truyền Thông",
                    description: "Quản lý các hoạt động truyền thông của CLB",
                    leaderName: "Nguyễn Văn A",
                    status: "active"
                },
                // Thêm data mẫu khác...
            ];
            setDepartments(mockData);
        } catch (err) {
            setError('Không thể tải danh sách ban');
            console.error(err);
        } finally {
            setIsLoading(false);
        }
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsLoading(true);
        try {
            if (currentDepartment) {
                // Update existing department
                const updatedDepartments = departments.map(department =>
                    department.id === currentDepartment.id ? currentDepartment : department
                );
                setDepartments(updatedDepartments);
            } else {
                // Add new department
                const newDepartment: Department = {
                    id: departments.length + 1,
                    name: '',
                    description: '',
                    leaderName: '',
                    status: 'active'
                };
                setDepartments([...departments, newDepartment]);
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
        setCurrentDepartment(null);
        setShowModal(false);
    };

    const filteredDepartments = departments.filter(department =>
        department.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        department.leaderName.toLowerCase().includes(searchTerm.toLowerCase())
    );

    return (
        <div className={styles.managerContainer}>
            <div className={styles.managerHeader}>
                <h2>Quản lý Ban</h2>
                <div className={styles.headerActions}>
                    <div className={styles.searchBox}>
                        <i className="fas fa-search"></i>
                        <input
                            type="text"
                            placeholder="Tìm kiếm theo tên ban, trưởng ban..."
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                        />
                    </div>
                    <button 
                        className={styles.addButton}
                        onClick={() => setShowModal(true)}
                    >
                        <i className="fas fa-plus"></i>
                        Thêm ban
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
                            <th>Tên ban</th>
                            <th>Mô tả</th>
                            <th>Trưởng ban</th>
                            <th>Trạng thái</th>
                            <th>Hoạt động</th>
                        </tr>
                    </thead>
                    <tbody>
                        {isLoading ? (
                            <tr>
                                <td colSpan={6} className={styles.loading}>
                                    <i className="fas fa-spinner fa-spin"></i>
                                    Đang tải...
                                </td>
                            </tr>
                        ) : filteredDepartments.length === 0 ? (
                            <tr>
                                <td colSpan={6} className={styles.emptyState}>
                                    <i className="fas fa-user-slash"></i>
                                    <p>Không có ban nào</p>
                                </td>
                            </tr>
                        ) : (
                            filteredDepartments.map((department, index) => (
                                <tr key={department.id}>
                                    <td>{index + 1}</td>
                                    <td>{department.name}</td>
                                    <td>{department.description}</td>
                                    <td>{department.leaderName}</td>
                                    <td>
                                        <span className={`${styles.status} ${styles[department.status]}`}>
                                            {department.status === 'active' ? 'Đang hoạt động' : 'Ngừng hoạt động'}
                                        </span>
                                    </td>
                                    <td>
                                        <div className={styles.actions}>
                                            <button 
                                                onClick={() => {
                                                    setCurrentDepartment(department);
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
                                                    if (window.confirm('Bạn có chắc chắn muốn xóa ban này?')) {
                                                        setDepartments(departments.filter(d => d.id !== department.id));
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
                            <h3>{currentDepartment ? 'Sửa thông tin ban' : 'Thêm ban mới'}</h3>
                            <button 
                                className={styles.closeButton}
                                onClick={resetForm}
                            >
                                <i className="fas fa-times"></i>
                            </button>
                        </div>
                        <form onSubmit={handleSubmit}>
                            <div className={styles.formGroup}>
                                <label>Tên ban</label>
                                <input 
                                    type="text" 
                                    value={currentDepartment?.name || ''} 
                                    onChange={(e) => setCurrentDepartment(prev => 
                                        prev ? {...prev, name: e.target.value} : null
                                    )}
                                    required
                                />
                            </div>

                            <div className={styles.formGroup}>
                                <label>Mô tả</label>
                                <textarea 
                                    value={currentDepartment?.description || ''} 
                                    onChange={(e) => setCurrentDepartment(prev => 
                                        prev ? {...prev, description: e.target.value} : null
                                    )}
                                    rows={4}
                                    required
                                />
                            </div>

                            <div className={styles.formGroup}>
                                <label>Trưởng ban</label>
                                <input 
                                    type="text" 
                                    value={currentDepartment?.leaderName || ''} 
                                    onChange={(e) => setCurrentDepartment(prev => 
                                        prev ? {...prev, leaderName: e.target.value} : null
                                    )}
                                    required
                                />
                            </div>

                            <div className={styles.formGroup}>
                                <label>Trạng thái</label>
                                <select
                                    value={currentDepartment?.status || 'active'}
                                    onChange={(e) => setCurrentDepartment(prev => 
                                        prev ? {...prev, status: e.target.value as 'active' | 'inactive'} : null
                                    )}
                                >
                                    <option value="active">Đang hoạt động</option>
                                    <option value="inactive">Ngừng hoạt động</option>
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
                                        <i className={`fas fa-${currentDepartment ? 'save' : 'plus'}`}></i>
                                    )}
                                    {currentDepartment ? 'Cập nhật' : 'Thêm mới'}
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

export default DepartmentsManager; 