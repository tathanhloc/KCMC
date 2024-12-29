import React, { useState } from 'react';
import styles from '../../dashboard/Dashboard.module.scss';

interface LeadershipMember {
    id: number;
    name: string;
    position: string;
    imageUrl: string;
    description: string;
    email: string;
    phone: string;
}

const LeadershipManager: React.FC = () => {
    const [members, setMembers] = useState<LeadershipMember[]>([
        {
            id: 1,
            name: "Nguyễn Văn A",
            position: "Chủ nhiệm CLB",
            imageUrl: "/avatar-placeholder.png",
            description: "Chủ nhiệm CLB nhiệm kỳ 2023-2024",
            email: "nguyenvana@example.com",
            phone: "0123456789"
        }
    ]);
    const [currentMember, setCurrentMember] = useState<LeadershipMember | null>(null);
    const [previewImage, setPreviewImage] = useState<string | null>(null);

    const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (file) {
            const reader = new FileReader();
            reader.onloadend = () => {
                setPreviewImage(reader.result as string);
            };
            reader.readAsDataURL(file);
        }
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        // Xử lý thêm/sửa thành viên
    };

    return (
        <div className={styles.managerContainer}>
            <h2>Quản lý Ban Chủ Nhiệm</h2>
            
            <div className={styles.managerContent}>
                <div className={styles.formSection}>
                    <h3>{currentMember ? 'Sửa thông tin' : 'Thêm thành viên mới'}</h3>
                    <form onSubmit={handleSubmit}>
                        <div className={styles.imagePreview}>
                            <img 
                                src={previewImage || currentMember?.imageUrl || '/avatar-placeholder.png'} 
                                alt="Preview" 
                            />
                            <input 
                                type="file" 
                                accept="image/*" 
                                onChange={handleImageChange}
                            />
                        </div>

                        <div className={styles.formGroup}>
                            <label>Họ và tên</label>
                            <input 
                                type="text" 
                                value={currentMember?.name || ''} 
                                onChange={(e) => setCurrentMember(prev => 
                                    prev ? {...prev, name: e.target.value} : null
                                )}
                            />
                        </div>

                        <div className={styles.formGroup}>
                            <label>Chức vụ</label>
                            <input 
                                type="text" 
                                value={currentMember?.position || ''} 
                                onChange={(e) => setCurrentMember(prev => 
                                    prev ? {...prev, position: e.target.value} : null
                                )}
                            />
                        </div>

                        <div className={styles.formGroup}>
                            <label>Email</label>
                            <input 
                                type="email" 
                                value={currentMember?.email || ''} 
                                onChange={(e) => setCurrentMember(prev => 
                                    prev ? {...prev, email: e.target.value} : null
                                )}
                            />
                        </div>

                        <div className={styles.formGroup}>
                            <label>Số điện thoại</label>
                            <input 
                                type="tel" 
                                value={currentMember?.phone || ''} 
                                onChange={(e) => setCurrentMember(prev => 
                                    prev ? {...prev, phone: e.target.value} : null
                                )}
                            />
                        </div>

                        <div className={styles.formGroup}>
                            <label>Mô tả</label>
                            <textarea 
                                value={currentMember?.description || ''} 
                                onChange={(e) => setCurrentMember(prev => 
                                    prev ? {...prev, description: e.target.value} : null
                                )}
                            />
                        </div>

                        <button type="submit" className={styles.submitButton}>
                            {currentMember ? 'Cập nhật' : 'Thêm mới'}
                        </button>
                    </form>
                </div>

                <div className={styles.listSection}>
                    <h3>Danh sách Ban Chủ Nhiệm</h3>
                    <div className={styles.memberList}>
                        {members.map(member => (
                            <div key={member.id} className={styles.memberItem}>
                                <img src={member.imageUrl} alt={member.name} />
                                <div className={styles.memberInfo}>
                                    <h4>{member.name}</h4>
                                    <p className={styles.position}>{member.position}</p>
                                    <p>{member.description}</p>
                                </div>
                                <div className={styles.actions}>
                                    <button onClick={() => setCurrentMember(member)}>
                                        <i className="fas fa-edit"></i>
                                    </button>
                                    <button onClick={() => {
                                        // Xử lý xóa
                                    }}>
                                        <i className="fas fa-trash"></i>
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

export default LeadershipManager; 