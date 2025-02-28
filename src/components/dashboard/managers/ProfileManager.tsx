import React, { useState } from 'react';
import styles from '../Dashboard.module.scss';
import { UserRole } from '../../../types/auth.types';

interface ProfileManagerProps {
    userRole: UserRole;
}

interface ProfileData {
    fullName: string;
    email: string;
    phone: string;
    position: string;
    bio: string;
    avatar: string;
}

const ProfileManager: React.FC<ProfileManagerProps> = ({ userRole }) => {
    // Admin không được phép truy cập component này
    if (userRole === 'super_admin') {
        return (
            <div className={styles.errorContainer}>
                <h2>Không có quyền truy cập</h2>
                <p>Super Admin không được phép thay đổi thông tin cá nhân</p>
            </div>
        );
    }

    const [profile, setProfile] = useState<ProfileData>({
        fullName: 'Nguyễn Văn A',
        email: 'nguyenvana@example.com',
        phone: '0123456789',
        position: 'Chủ nhiệm CLB',
        bio: 'Thông tin giới thiệu về bản thân...',
        avatar: '/avatar-placeholder.png'
    });

    const [previewImage, setPreviewImage] = useState<string | null>(null);
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [success, setSuccess] = useState<string | null>(null);

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

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsLoading(true);
        setError(null);
        setSuccess(null);

        try {
            // API call sẽ được thêm sau
            await new Promise(resolve => setTimeout(resolve, 1000)); // Giả lập API call
            setSuccess('Cập nhật thông tin thành công!');
        } catch (err) {
            setError('Có lỗi xảy ra khi cập nhật thông tin');
            console.error(err);
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className={styles.profileContainer}>
            <h2>Thông tin cá nhân</h2>
            
            {error && (
                <div className={styles.errorMessage}>
                    <i className="fas fa-exclamation-circle"></i>
                    {error}
                </div>
            )}
            
            {success && (
                <div className={styles.successMessage}>
                    <i className="fas fa-check-circle"></i>
                    {success}
                </div>
            )}

            <div className={styles.profileContent}>
                <form onSubmit={handleSubmit}>
                    <div className={styles.avatarSection}>
                        <img 
                            src={previewImage || profile.avatar} 
                            alt="Profile" 
                            className={styles.profileAvatar} 
                        />
                        <input 
                            type="file" 
                            accept="image/*" 
                            onChange={handleImageChange}
                            id="avatarInput"
                            className={styles.avatarInput} 
                        />
                        <label htmlFor="avatarInput" className={styles.avatarLabel}>
                            <i className="fas fa-camera"></i>
                            <span>Thay đổi ảnh</span>
                        </label>
                    </div>

                    <div className={styles.formGroup}>
                        <label>Họ và tên</label>
                        <input
                            type="text"
                            value={profile.fullName}
                            onChange={(e) => setProfile({...profile, fullName: e.target.value})}
                            required
                        />
                    </div>

                    <div className={styles.formGroup}>
                        <label>Email</label>
                        <input
                            type="email"
                            value={profile.email}
                            onChange={(e) => setProfile({...profile, email: e.target.value})}
                            required
                        />
                    </div>

                    <div className={styles.formGroup}>
                        <label>Số điện thoại</label>
                        <input
                            type="tel"
                            value={profile.phone}
                            onChange={(e) => setProfile({...profile, phone: e.target.value})}
                            required
                        />
                    </div>

                    <div className={styles.formGroup}>
                        <label>Chức vụ</label>
                        <input
                            type="text"
                            value={profile.position}
                            onChange={(e) => setProfile({...profile, position: e.target.value})}
                            required
                        />
                    </div>

                    <div className={styles.formGroup}>
                        <label>Giới thiệu bản thân</label>
                        <textarea
                            value={profile.bio}
                            onChange={(e) => setProfile({...profile, bio: e.target.value})}
                            rows={4}
                        />
                    </div>

                    <button 
                        type="submit" 
                        className={styles.submitButton}
                        disabled={isLoading}
                    >
                        {isLoading ? (
                            <i className="fas fa-spinner fa-spin"></i>
                        ) : (
                            <i className="fas fa-save"></i>
                        )}
                        Lưu thay đổi
                    </button>
                </form>
            </div>
        </div>
    );
};

export default ProfileManager; 