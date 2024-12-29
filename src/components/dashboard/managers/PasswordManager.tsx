import React, { useState } from 'react';
import styles from '../Dashboard.module.scss';
import { UserRole } from '../../../types/auth.types';

interface PasswordManagerProps {
    userRole: UserRole;
}

interface PasswordData {
    current: string;
    new: string;
    confirm: string;
}

const PasswordManager: React.FC<PasswordManagerProps> = ({ userRole }) => {
    const [passwords, setPasswords] = useState<PasswordData>({
        current: '',
        new: '',
        confirm: ''
    });
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [success, setSuccess] = useState<string | null>(null);
    const [showPassword, setShowPassword] = useState({
        current: false,
        new: false,
        confirm: false
    });

    const validatePassword = (password: string): boolean => {
        const minLength = password.length >= 8;
        const hasUpper = /[A-Z]/.test(password);
        const hasLower = /[a-z]/.test(password);
        const hasNumber = /[0-9]/.test(password);
        const hasSpecial = /[!@#$%^&*]/.test(password);
        
        return minLength && hasUpper && hasLower && hasNumber && hasSpecial;
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setError(null);
        setSuccess(null);

        // Validation
        if (!passwords.current || !passwords.new || !passwords.confirm) {
            setError('Vui lòng điền đầy đủ thông tin');
            return;
        }

        if (passwords.new !== passwords.confirm) {
            setError('Mật khẩu mới không khớp');
            return;
        }

        if (!validatePassword(passwords.new)) {
            setError('Mật khẩu mới không đủ mạnh');
            return;
        }

        setIsLoading(true);
        try {
            // API call sẽ được thêm sau
            await new Promise(resolve => setTimeout(resolve, 1000)); // Giả lập API call
            setSuccess('Đổi mật khẩu thành công!');
            setPasswords({ current: '', new: '', confirm: '' });
        } catch (err) {
            setError('Có lỗi xảy ra khi đổi mật khẩu');
            console.error(err);
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className={styles.passwordContainer}>
            <h2>Đổi mật khẩu</h2>

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

            <div className={styles.passwordContent}>
                <form onSubmit={handleSubmit} className={styles.passwordForm}>
                    <div className={styles.formGroup}>
                        <label>Mật khẩu hiện tại</label>
                        <div className={styles.passwordInput}>
                            <input
                                type={showPassword.current ? "text" : "password"}
                                value={passwords.current}
                                onChange={(e) => setPasswords({...passwords, current: e.target.value})}
                                required
                            />
                            <button
                                type="button"
                                className={styles.togglePassword}
                                onClick={() => setShowPassword({...showPassword, current: !showPassword.current})}
                            >
                                <i className={`fas fa-eye${showPassword.current ? '-slash' : ''}`}></i>
                            </button>
                        </div>
                    </div>

                    <div className={styles.formGroup}>
                        <label>Mật khẩu mới</label>
                        <div className={styles.passwordInput}>
                            <input
                                type={showPassword.new ? "text" : "password"}
                                value={passwords.new}
                                onChange={(e) => setPasswords({...passwords, new: e.target.value})}
                                required
                            />
                            <button
                                type="button"
                                className={styles.togglePassword}
                                onClick={() => setShowPassword({...showPassword, new: !showPassword.new})}
                            >
                                <i className={`fas fa-eye${showPassword.new ? '-slash' : ''}`}></i>
                            </button>
                        </div>
                    </div>

                    <div className={styles.formGroup}>
                        <label>Xác nhận mật khẩu mới</label>
                        <div className={styles.passwordInput}>
                            <input
                                type={showPassword.confirm ? "text" : "password"}
                                value={passwords.confirm}
                                onChange={(e) => setPasswords({...passwords, confirm: e.target.value})}
                                required
                            />
                            <button
                                type="button"
                                className={styles.togglePassword}
                                onClick={() => setShowPassword({...showPassword, confirm: !showPassword.confirm})}
                            >
                                <i className={`fas fa-eye${showPassword.confirm ? '-slash' : ''}`}></i>
                            </button>
                        </div>
                    </div>

                    <div className={styles.passwordRequirements}>
                        <h4>
                            <i className="fas fa-shield-alt"></i>
                            Yêu cầu mật khẩu
                        </h4>
                        <ul>
                            <li className={passwords.new.length >= 8 ? styles.valid : ''}>
                                <i className="fas fa-check"></i>
                                Ít nhất 8 ký tự
                            </li>
                            <li className={/[A-Z]/.test(passwords.new) ? styles.valid : ''}>
                                <i className="fas fa-check"></i>
                                Ít nhất 1 chữ hoa
                            </li>
                            <li className={/[a-z]/.test(passwords.new) ? styles.valid : ''}>
                                <i className="fas fa-check"></i>
                                Ít nhất 1 chữ thường
                            </li>
                            <li className={/[0-9]/.test(passwords.new) ? styles.valid : ''}>
                                <i className="fas fa-check"></i>
                                Ít nhất 1 số
                            </li>
                            <li className={/[!@#$%^&*]/.test(passwords.new) ? styles.valid : ''}>
                                <i className="fas fa-check"></i>
                                Ít nhất 1 ký tự đặc biệt (!@#$%^&*)
                            </li>
                        </ul>
                    </div>

                    <button 
                        type="submit" 
                        className={styles.submitButton}
                        disabled={isLoading}
                    >
                        {isLoading ? (
                            <i className="fas fa-spinner fa-spin"></i>
                        ) : (
                            <i className="fas fa-key"></i>
                        )}
                        Đổi mật khẩu
                    </button>
                </form>
            </div>
        </div>
    );
};

export default PasswordManager; 