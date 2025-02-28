import React, { useState, useEffect } from 'react';
import styles from '../Dashboard.module.scss';
import { 
    getFirestore, 
    collection, 
    addDoc, 
    updateDoc, 
    deleteDoc, 
    getDocs, 
    doc, 
    query, 
    orderBy 
} from 'firebase/firestore';
import { UserRole } from '../../../types/auth.types';

interface AboutItem {
    id: string;
    title: string;
    description: string;
    icon: string;
    order: number;
    createdAt: Date;
}

interface AboutManagerProps {
    userRole: UserRole;
}

const AboutManager: React.FC<AboutManagerProps> = ({ userRole }) => {
    const [aboutItems, setAboutItems] = useState<AboutItem[]>([]);
    const [currentItem, setCurrentItem] = useState<AboutItem | null>(null);
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [success, setSuccess] = useState<string | null>(null);
    const [showModal, setShowModal] = useState(false);

    // Danh sách icon để người dùng chọn, sử dụng emoji thay thế
    const availableIcons = [
        { value: 'fa-rocket', label: 'Tên lửa', emoji: '🚀' },
        { value: 'fa-eye', label: 'Mắt/Tầm nhìn', emoji: '👁️' },
        { value: 'fa-users', label: 'Nhóm người', emoji: '👥' },
        { value: 'fa-heart', label: 'Trái tim', emoji: '❤️' },
        { value: 'fa-star', label: 'Ngôi sao', emoji: '⭐' },
        { value: 'fa-lightbulb', label: 'Bóng đèn', emoji: '💡' },
        { value: 'fa-trophy', label: 'Cúp', emoji: '🏆' },
        { value: 'fa-certificate', label: 'Chứng chỉ', emoji: '🎖️' },
        { value: 'fa-handshake', label: 'Bắt tay', emoji: '🤝' },
        { value: 'fa-chart-line', label: 'Biểu đồ', emoji: '📈' }
    ];

    // Hàm helper để lấy emoji từ giá trị icon
    const getEmojiFromIconValue = (iconValue: string) => {
        const icon = availableIcons.find(i => i.value === iconValue);
        return icon ? icon.emoji : '🔍';
    };

    // Firebase references
    const db = getFirestore();
    const aboutCollection = collection(db, 'about');

    // Fetch about items on component mount
    useEffect(() => {
        fetchAboutItems();
    }, []);

    // Function to fetch about items from Firestore
    const fetchAboutItems = async () => {
        setIsLoading(true);
        setError(null);
        try {
            const q = query(aboutCollection, orderBy('order', 'asc'));
            const querySnapshot = await getDocs(q);
            
            const items: AboutItem[] = [];
            querySnapshot.forEach((doc) => {
                const data = doc.data();
                items.push({
                    id: doc.id,
                    title: data.title,
                    description: data.description,
                    icon: data.icon,
                    order: data.order,
                    createdAt: data.createdAt.toDate()
                });
            });
            
            setAboutItems(items);
        } catch (err) {
            console.error('Error fetching about items:', err);
            setError('Không thể tải thông tin about. Vui lòng thử lại sau.');
        } finally {
            setIsLoading(false);
        }
    };

    // Reset form and states
    const resetForm = () => {
        setCurrentItem(null);
        setShowModal(false);
        setError(null);
        setSuccess(null);
    };

    // Handle form submission (add/update about item)
    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsLoading(true);
        setError(null);
        setSuccess(null);

        if (!currentItem?.title || !currentItem?.description || !currentItem?.icon) {
            setError('Vui lòng điền đầy đủ thông tin.');
            setIsLoading(false);
            return;
        }

        try {
            if (currentItem.id) {
                // Update existing item
                const itemRef = doc(db, 'about', currentItem.id);
                await updateDoc(itemRef, {
                    title: currentItem.title,
                    description: currentItem.description,
                    icon: currentItem.icon,
                    order: currentItem.order || aboutItems.length,
                    updatedAt: new Date()
                });
                setSuccess('Thông tin đã được cập nhật thành công!');
            } else {
                // Add new item
                await addDoc(aboutCollection, {
                    title: currentItem.title,
                    description: currentItem.description,
                    icon: currentItem.icon,
                    order: aboutItems.length,
                    createdAt: new Date(),
                    updatedAt: new Date()
                });
                setSuccess('Thông tin đã được thêm thành công!');
            }

            // Refresh the items list
            fetchAboutItems();
            
            // Close modal after short delay
            setTimeout(() => {
                resetForm();
            }, 1500);
            
        } catch (err) {
            console.error('Error saving about item:', err);
            setError('Có lỗi xảy ra khi lưu thông tin. Vui lòng thử lại sau.');
        } finally {
            setIsLoading(false);
        }
    };

    // Handle item deletion
    const handleDelete = async (item: AboutItem) => {
        if (!window.confirm(`Bạn có chắc chắn muốn xóa mục "${item.title}"?`)) {
            return;
        }

        setIsLoading(true);
        try {
            // Delete the document
            await deleteDoc(doc(db, 'about', item.id));
            
            setSuccess('Thông tin đã được xóa thành công!');
            
            // Refresh the items list
            fetchAboutItems();
        } catch (err) {
            console.error('Error deleting about item:', err);
            setError('Có lỗi xảy ra khi xóa thông tin. Vui lòng thử lại sau.');
        } finally {
            setIsLoading(false);
        }
    };

    // Open add/edit modal
    const openModal = (item?: AboutItem) => {
        if (item) {
            setCurrentItem(item);
        } else {
            setCurrentItem({
                id: '',
                title: '',
                description: '',
                icon: '',
                order: aboutItems.length,
                createdAt: new Date()
            });
        }
        setShowModal(true);
    };
    

    return (
        <div className={styles.managerContainer}>
            <div className={styles.managerHeader}>
                <h2>Quản lý About Us</h2>
                <div className={styles.headerActions}>
                    <button 
                        className={styles.addButton}
                        onClick={() => openModal()}
                    >
                        <i className="fas fa-plus"></i>
                        Thêm mục mới
                    </button>
                </div>
            </div>

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

            {isLoading && !showModal ? (
                <div className={styles.loadingState}>
                    <i className="fas fa-spinner fa-spin"></i>
                    <p>Đang tải dữ liệu...</p>
                </div>
            ) : aboutItems.length === 0 ? (
                <div className={styles.emptyState}>
                    <i className="fas fa-info-circle"></i>
                    <p>Chưa có thông tin về câu lạc bộ. Bắt đầu bằng cách thêm mục mới!</p>
                    <button 
                        className={styles.addButtonLarge}
                        onClick={() => openModal()}
                    >
                        <i className="fas fa-plus-circle"></i>
                        Thêm mục đầu tiên
                    </button>
                </div>
            ) : (
                
                <div className={styles.aboutGrid}>
                    {aboutItems.map(item => (
                        <div key={item.id} className={styles.aboutCard}>
                            <div className={styles.aboutCardHeader}>
                                <div className={styles.aboutIconWrapper}>
                                    <span style={{ fontSize: '32px' }}>{getEmojiFromIconValue(item.icon)}</span>
                                </div>
                                <div className={styles.aboutOrder}>{item.order + 1}</div>
                            </div>
                            <div className={styles.aboutContent}>
                                <h3 className={styles.aboutTitle}>{item.title}</h3>
                                <p className={styles.aboutDescription}>{item.description}</p>
                            </div>
                            <div className={styles.aboutActions}>
                                <button 
                                    className={styles.editButton} 
                                    onClick={() => openModal(item)}
                                >
                                    <i className="fas fa-edit"></i>
                                    Sửa
                                </button>
                                <button 
                                    className={styles.deleteButton} 
                                    onClick={() => handleDelete(item)}
                                >
                                    <i className="fas fa-trash"></i>
                                    Xóa
                                </button>
                            </div>
                        </div>
                    ))}
                </div>
            )}

            {/* Modal for adding/editing about item */}
            {showModal && (
                <div className={styles.modal}>
                    <div className={styles.modalContent}>
                        <div className={styles.modalHeader}>
                            <h3>{currentItem?.id ? 'Sửa thông tin' : 'Thêm mục mới'}</h3>
                            <button 
                                className={styles.closeButton}
                                onClick={resetForm}
                                type="button"
                            >
                                <i className="fas fa-times"></i>
                            </button>
                        </div>
                        
                        <form onSubmit={handleSubmit}>
                            <div className={styles.formLayout}>
                                <div className={styles.formIconSection}>
                                    <div className={styles.iconPreview}>
                                        {currentItem?.icon ? (
                                            <span style={{ fontSize: '60px' }}>{getEmojiFromIconValue(currentItem.icon)}</span>
                                        ) : (
                                            <div className={styles.iconPlaceholder}>
                                                <span style={{ fontSize: '40px' }}>🔍</span>
                                                <p>Chọn biểu tượng</p>
                                            </div>
                                        )}
                                    </div>
                                    
                                    <div className={styles.iconSelector}>
                                        <h4>Chọn biểu tượng:</h4>
                                            <div className={styles.iconGrid}>
                                            {availableIcons.map(icon => (
                                                <div 
                                                key={icon.value}
                                                className={`${styles.iconItem} ${currentItem?.icon === icon.value ? styles.activeIcon : ''}`}
                                                onClick={() => setCurrentItem(prev => 
                                                    prev ? {...prev, icon: icon.value} : null
                                                )}
                                                title={icon.label}
                                                >
                                                <span style={{ fontSize: '24px' }}>{icon.emoji}</span>
                                                </div>
                                            ))}
                                            </div>
                                    </div>
                                </div>
                                
                                <div className={styles.formFieldsSection}>
                                    <div className={styles.formGroup}>
                                        <label htmlFor="aboutTitle">
                                            <i className="fas fa-heading"></i>
                                            Tiêu đề
                                        </label>
                                        <input 
                                            id="aboutTitle"
                                            type="text" 
                                            value={currentItem?.title || ''} 
                                            onChange={(e) => setCurrentItem(prev => 
                                                prev ? {...prev, title: e.target.value} : null
                                            )}
                                            placeholder="Nhập tiêu đề (ví dụ: Sứ mệnh, Tầm nhìn...)"
                                            required
                                            className={styles.formInput}
                                        />
                                    </div>
                                    
                                    <div className={styles.formGroup}>
                                        <label htmlFor="aboutDescription">
                                            <i className="fas fa-align-left"></i>
                                            Mô tả
                                        </label>
                                        <textarea 
                                            id="aboutDescription"
                                            value={currentItem?.description || ''} 
                                            onChange={(e) => setCurrentItem(prev => 
                                                prev ? {...prev, description: e.target.value} : null
                                            )}
                                            placeholder="Nhập nội dung mô tả chi tiết"
                                            required
                                            className={styles.formTextarea}
                                            rows={5}
                                        />
                                    </div>
                                    
                                    <div className={styles.formGroup}>
                                        <label htmlFor="aboutOrder">
                                            <i className="fas fa-sort-numeric-down"></i>
                                            Thứ tự hiển thị
                                        </label>
                                        <input 
                                            id="aboutOrder"
                                            type="number" 
                                            min="0"
                                            value={currentItem?.order || 0} 
                                            onChange={(e) => setCurrentItem(prev => 
                                                prev ? {...prev, order: parseInt(e.target.value)} : null
                                            )}
                                            required
                                            className={styles.formInput}
                                        />
                                        <small>Số thấp hơn sẽ hiển thị trước</small>
                                    </div>
                                    
                                    <div className={styles.previewBox}>
                                        <h4>Xem trước</h4>
                                        <div className={styles.previewContent}>
                                            <div className={styles.previewHeader}>
                                                {currentItem?.icon && (
                                                    <span style={{ fontSize: '24px', marginRight: '8px' }}>
                                                        {getEmojiFromIconValue(currentItem.icon)}
                                                    </span>
                                                )}
                                                <span>{currentItem?.title || 'Tiêu đề'}</span>
                                            </div>
                                            <div className={styles.previewDescription}>
                                                {currentItem?.description || 'Mô tả sẽ xuất hiện ở đây'}
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                            
                            <div className={styles.modalActions}>
                                <button
                                    type="submit"
                                    className={styles.submitButton}
                                    disabled={isLoading}
                                >
                                    {isLoading ? (
                                        <>
                                            <i className="fas fa-spinner fa-spin"></i>
                                            Đang xử lý...
                                        </>
                                    ) : currentItem?.id ? 'Cập nhật thông tin' : 'Thêm mục mới'}
                                </button>
                                <button
                                    type="button"
                                    className={styles.cancelButton}
                                    onClick={resetForm}
                                >
                                    Hủy bỏ
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </div>
    );
};

export default AboutManager;