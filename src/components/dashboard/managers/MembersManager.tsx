import React, { useState, useEffect } from 'react';
import styles from '../Dashboard.module.scss';
import { UserRole } from '../../../types/auth.types';

interface Member {
    id: number;
    studentId: string;    // MSSV
    fullName: string;     // Họ và tên
    className: string;    // Lớp
    faculty: string;      // Khoa
    academicYear: string; // Khóa
    status: 'active' | 'inactive'; // Trạng thái
    activities: string[]; // Các hoạt động tham gia
}

interface MembersManagerProps {
    userRole: UserRole;
}

const MembersManager: React.FC<MembersManagerProps> = ({ userRole }) => {
    const [members, setMembers] = useState<Member[]>([]);
    const [showModal, setShowModal] = useState(false);
    const [searchTerm, setSearchTerm] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [currentMember, setCurrentMember] = useState<Member | null>(null);

    // Form state
    const [formData, setFormData] = useState({
        studentId: '',
        fullName: '',
        className: '',
        faculty: '',
        academicYear: '',
        status: 'active' as const,
        activities: [] as string[]
    });

    useEffect(() => {
        fetchMembers();
    }, []);

    const fetchMembers = async () => {
        setIsLoading(true);
        try {
            // API call sẽ được thêm sau
            const mockData: Member[] = [
                {
                    id: 1,
                    studentId: "20110001",
                    fullName: "Nguyễn Văn A",
                    className: "DHKTPM15A",
                    faculty: "Công nghệ thông tin",
                    academicYear: "2020-2024",
                    status: "active",
                    activities: ["Workshop AI", "Teambuilding 2023"]
                },
                // Thêm data mẫu khác...
            ];
            setMembers(mockData);
        } catch (err) {
            setError('Không thể tải danh sách thành viên');
            console.error(err);
        } finally {
            setIsLoading(false);
        }
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsLoading(true);
        try {
            if (currentMember) {
                // Update existing member
                const updatedMembers = members.map(member =>
                    member.id === currentMember.id ? { ...currentMember, ...formData } : member
                );
                setMembers(updatedMembers);
            } else {
                // Add new member
                const newMember: Member = {
                    id: members.length + 1,
                    ...formData
                };
                setMembers([...members, newMember]);
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
        setFormData({
            studentId: '',
            fullName: '',
            className: '',
            faculty: '',
            academicYear: '',
            status: 'active',
            activities: []
        });
        setCurrentMember(null);
    };

    const filteredMembers = members.filter(member =>
        member.studentId.toLowerCase().includes(searchTerm.toLowerCase()) ||
        member.fullName.toLowerCase().includes(searchTerm.toLowerCase()) ||
        member.className.toLowerCase().includes(searchTerm.toLowerCase())
    );

    return (
        <div className={styles.managerContainer}>
            <div className={styles.managerHeader}>
                <h2>Quản lý Thành viên CLB</h2>
                <div className={styles.headerActions}>
                    <div className={styles.searchBox}>
                        <i className="fas fa-search"></i>
                        <input
                            type="text"
                            placeholder="Tìm kiếm theo MSSV, tên, lớp..."
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                        />
                    </div>
                    <button 
                        className={styles.addButton}
                        onClick={() => setShowModal(true)}
                    >
                        <i className="fas fa-plus"></i>
                        Thêm thành viên
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
                            <th>MSSV</th>
                            <th>Họ và tên</th>
                            <th>Lớp</th>
                            <th>Khoa</th>
                            <th>Khóa</th>
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
                        ) : filteredMembers.length === 0 ? (
                            <tr>
                                <td colSpan={8} className={styles.emptyState}>
                                    <i className="fas fa-users-slash"></i>
                                    <p>Không có thành viên nào</p>
                                </td>
                            </tr>
                        ) : (
                            filteredMembers.map((member, index) => (
                                <tr key={member.id}>
                                    <td>{index + 1}</td>
                                    <td>{member.studentId}</td>
                                    <td>{member.fullName}</td>
                                    <td>{member.className}</td>
                                    <td>{member.faculty}</td>
                                    <td>{member.academicYear}</td>
                                    <td>
                                        <span className={`${styles.status} ${styles[member.status]}`}>
                                            {member.status === 'active' ? 'Đang hoạt động' : 'Ngừng hoạt động'}
                                        </span>
                                    </td>
                                    <td>
                                        <div className={styles.actions}>
                                            <button 
                                                onClick={() => {
                                                    setCurrentMember(member);
                                                    setFormData(member);
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
                                                    // Xử lý xóa
                                                    if (window.confirm('Bạn có chắc chắn muốn xóa thành viên này?')) {
                                                        setMembers(members.filter(m => m.id !== member.id));
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
                            <h3>{currentMember ? 'Sửa thông tin thành viên' : 'Thêm thành viên mới'}</h3>
                            <button 
                                className={styles.closeButton}
                                onClick={() => {
                                    setShowModal(false);
                                    resetForm();
                                }}
                            >
                                <i className="fas fa-times"></i>
                            </button>
                        </div>
                        <form onSubmit={handleSubmit}>
                            <div className={styles.formGroup}>
                                <label>MSSV</label>
                                <input
                                    type="text"
                                    value={formData.studentId}
                                    onChange={(e) => setFormData({...formData, studentId: e.target.value})}
                                    required
                                />
                            </div>
                            <div className={styles.formGroup}>
                                <label>Họ và tên</label>
                                <input
                                    type="text"
                                    value={formData.fullName}
                                    onChange={(e) => setFormData({...formData, fullName: e.target.value})}
                                    required
                                />
                            </div>
                            <div className={styles.formRow}>
                                <div className={styles.formGroup}>
                                    <label>Lớp</label>
                                    <input
                                        type="text"
                                        value={formData.className}
                                        onChange={(e) => setFormData({...formData, className: e.target.value})}
                                        required
                                    />
                                </div>
                                <div className={styles.formGroup}>
                                    <label>Khóa</label>
                                    <input
                                        type="text"
                                        value={formData.academicYear}
                                        onChange={(e) => setFormData({...formData, academicYear: e.target.value})}
                                        required
                                    />
                                </div>
                            </div>
                            <div className={styles.formGroup}>
                                <label>Khoa</label>
                                <input
                                    type="text"
                                    value={formData.faculty}
                                    onChange={(e) => setFormData({...formData, faculty: e.target.value})}
                                    required
                                />
                            </div>
                            <div className={styles.formGroup}>
                                <label>Trạng thái</label>
                                <select
                                    value={formData.status}
                                    onChange={(e) => setFormData({
                                        ...formData, 
                                        status: e.target.value as 'active' | 'inactive'
                                    })}
                                >
                                    <option value="active">Đang hoạt động</option>
                                    <option value="inactive">Ngừng hoạt động</option>
                                </select>
                            </div>
                            <div className={styles.formGroup}>
                                <label>Hoạt động tham gia</label>
                                <input
                                    type="text"
                                    placeholder="Nhập và nhấn Enter để thêm hoạt động"
                                    onKeyDown={(e) => {
                                        if (e.key === 'Enter') {
                                            e.preventDefault();
                                            const input = e.target as HTMLInputElement;
                                            if (input.value.trim()) {
                                                setFormData({
                                                    ...formData,
                                                    activities: [...formData.activities, input.value.trim()]
                                                });
                                                input.value = '';
                                            }
                                        }
                                    }}
                                />
                                <div className={styles.activitiesTags}>
                                    {formData.activities.map((activity, index) => (
                                        <span key={index} className={styles.activityTag}>
                                            {activity}
                                            <button
                                                type="button"
                                                onClick={() => {
                                                    setFormData({
                                                        ...formData,
                                                        activities: formData.activities.filter((_, i) => i !== index)
                                                    });
                                                }}
                                            >
                                                <i className="fas fa-times"></i>
                                            </button>
                                        </span>
                                    ))}
                                </div>
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
                                        <i className={`fas fa-${currentMember ? 'save' : 'plus'}`}></i>
                                    )}
                                    {currentMember ? 'Cập nhật' : 'Thêm mới'}
                                </button>
                                <button
                                    type="button"
                                    className={styles.cancelButton}
                                    onClick={() => {
                                        setShowModal(false);
                                        resetForm();
                                    }}
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

export default MembersManager; 