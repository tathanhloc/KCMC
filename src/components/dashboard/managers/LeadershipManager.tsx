import React, { useState, useEffect, useRef } from 'react';
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

interface LeadershipMember {
    id: string;
    name: string;
    role: string;
    description: string;
    imageData: string;
    order: number;
    createdAt: Date;
}

interface LeadershipManagerProps {
    userRole: UserRole;
}

const LeadershipManager: React.FC<LeadershipManagerProps> = ({ userRole }) => {
    const [members, setMembers] = useState<LeadershipMember[]>([]);
    const [currentMember, setCurrentMember] = useState<LeadershipMember | null>(null);
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [success, setSuccess] = useState<string | null>(null);
    const [showModal, setShowModal] = useState(false);
    const [imageFile, setImageFile] = useState<File | null>(null);
    const [imagePreview, setImagePreview] = useState<string | null>(null);
    const [imageFileSize, setImageFileSize] = useState<string>('');
    const [compressedSize, setCompressedSize] = useState<string>('');
    const fileInputRef = useRef<HTMLInputElement>(null);

    // Firebase references
    const db = getFirestore();
    const leadershipCollection = collection(db, 'leadership');

    // Fetch members on component mount
    useEffect(() => {
        fetchMembers();
    }, []);

    // Function to fetch leadership members from Firestore
    const fetchMembers = async () => {
        setIsLoading(true);
        setError(null);
        try {
            const q = query(leadershipCollection, orderBy('order', 'asc'));
            const querySnapshot = await getDocs(q);
            
            const membersData: LeadershipMember[] = [];
            querySnapshot.forEach((doc) => {
                const data = doc.data();
                membersData.push({
                    id: doc.id,
                    name: data.name,
                    role: data.role,
                    description: data.description,
                    imageData: data.imageData,
                    order: data.order,
                    createdAt: data.createdAt.toDate()
                });
            });
            
            setMembers(membersData);
        } catch (err) {
            console.error('Error fetching leadership members:', err);
            setError('Không thể tải dữ liệu ban lãnh đạo. Vui lòng thử lại sau.');
        } finally {
            setIsLoading(false);
        }
    };

    // Format file size to human-readable format
    const formatFileSize = (bytes: number): string => {
        if (bytes === 0) return '0 Bytes';
        const k = 1024;
        const sizes = ['Bytes', 'KB', 'MB', 'GB'];
        const i = Math.floor(Math.log(bytes) / Math.log(k));
        return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
    };

    // Handle image file selection
    const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (file) {
            // Validate file is an image
            if (!file.type.startsWith('image/')) {
                setError('Vui lòng chọn file hình ảnh hợp lệ (JPEG, PNG, etc.)');
                return;
            }
            
            // Validate file size - now accepting larger files since we'll compress them
            if (file.size > 200 * 1024 * 1024) { // 200MB
                setError('Kích thước file quá lớn. Vui lòng chọn file nhỏ hơn 200MB.');
                return;
            }
            
            setImageFile(file);
            setImageFileSize(formatFileSize(file.size));
            
            // Preview the selected image
            const reader = new FileReader();
            reader.onloadend = () => {
                setImagePreview(reader.result as string);
            };
            reader.readAsDataURL(file);
        }
    };

    // Reset form and states
    const resetForm = () => {
        setCurrentMember(null);
        setImageFile(null);
        setImagePreview(null);
        setImageFileSize('');
        setCompressedSize('');
        setShowModal(false);
        setError(null);
        setSuccess(null);
        if (fileInputRef.current) {
            fileInputRef.current.value = '';
        }
    };

    // Compress image and convert to Base64
    const compressImage = (file: File, maxSizeMB: number = 2): Promise<string> => {
        return new Promise((resolve, reject) => {
            const reader = new FileReader();
            reader.onload = (readerEvent) => {
                const img = new Image();
                img.onload = () => {
                    // Create canvas
                    const canvas = document.createElement('canvas');
                    let width = img.width;
                    let height = img.height;
                    
                    // Calculate new dimensions while preserving aspect ratio
                    let maxDimension = 1200; // Maximum dimension for either width or height
                    if (width > height && width > maxDimension) {
                        height = Math.round(height * maxDimension / width);
                        width = maxDimension;
                    } else if (height > width && height > maxDimension) {
                        width = Math.round(width * maxDimension / height);
                        height = maxDimension;
                    }
                    
                    canvas.width = width;
                    canvas.height = height;
                    
                    // Draw image on canvas
                    const ctx = canvas.getContext('2d');
                    if (!ctx) {
                        reject(new Error('Unable to get canvas context'));
                        return;
                    }
                    ctx.drawImage(img, 0, 0, width, height);
                    
                    // Start with a high quality
                    let quality = 0.9;
                    const maxSizeBytes = maxSizeMB * 1024 * 1024;
                    
                    // Try to compress iteratively
                    const tryCompress = () => {
                        const base64String = canvas.toDataURL('image/jpeg', quality);
                        
                        // Calculate approximate size (base64 is about 4/3 of the actual bytes)
                        const base64Length = base64String.length - 'data:image/jpeg;base64,'.length;
                        const approximateBytes = Math.ceil(base64Length * 0.75);
                        
                        if (approximateBytes > maxSizeBytes && quality > 0.1) {
                            // Reduce quality and try again
                            quality -= 0.1;
                            tryCompress();
                        } else {
                            // We have a compressed image within target size or reached min quality
                            setCompressedSize(formatFileSize(approximateBytes));
                            resolve(base64String);
                        }
                    };
                    
                    tryCompress();
                };
                
                img.src = readerEvent.target?.result as string;
            };
            
            reader.onerror = reject;
            reader.readAsDataURL(file);
        });
    };

    // Handle form submission (add/update member)
    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsLoading(true);
        setError(null);
        setSuccess(null);

        if (!currentMember?.name || !currentMember?.role) {
            setError('Vui lòng điền đầy đủ thông tin cần thiết.');
            setIsLoading(false);
            return;
        }

        try {
            let imageData = currentMember.imageData || '';
            
            // Process image if a new one is selected
            if (imageFile) {
                try {
                    // Compress image before saving to Firebase
                    imageData = await compressImage(imageFile, 2); // Compress to max 2MB
                } catch (err) {
                    console.error('Error compressing image:', err);
                    setError('Không thể xử lý hình ảnh. Vui lòng thử lại với ảnh khác.');
                    setIsLoading(false);
                    return;
                }
            } else if (!currentMember.id && !imageData) {
                // Require image for new members
                setError('Vui lòng chọn hình ảnh cho thành viên.');
                setIsLoading(false);
                return;
            }

            if (currentMember.id) {
                // Update existing member
                const memberRef = doc(db, 'leadership', currentMember.id);
                await updateDoc(memberRef, {
                    name: currentMember.name,
                    role: currentMember.role,
                    description: currentMember.description || '',
                    imageData: imageData,
                    order: currentMember.order !== undefined ? currentMember.order : members.length,
                    updatedAt: new Date()
                });
                setSuccess('Thông tin thành viên đã được cập nhật thành công!');
            } else {
                // Add new member
                await addDoc(leadershipCollection, {
                    name: currentMember.name,
                    role: currentMember.role,
                    description: currentMember.description || '',
                    imageData: imageData,
                    order: members.length,
                    createdAt: new Date(),
                    updatedAt: new Date()
                });
                setSuccess('Thành viên mới đã được thêm thành công!');
            }

            // Refresh the members list
            fetchMembers();
            
            // Close modal after short delay
            setTimeout(() => {
                resetForm();
            }, 1500);
            
        } catch (err) {
            console.error('Error saving leadership member:', err);
            setError('Có lỗi xảy ra khi lưu thông tin. Vui lòng thử lại sau.');
        } finally {
            setIsLoading(false);
        }
    };

    // Handle member deletion
    const handleDelete = async (member: LeadershipMember) => {
        if (!window.confirm(`Bạn có chắc chắn muốn xóa thành viên "${member.name}"?`)) {
            return;
        }

        setIsLoading(true);
        try {
            // Delete the member document
            await deleteDoc(doc(db, 'leadership', member.id));
            
            setSuccess('Thành viên đã được xóa thành công!');
            
            // Refresh the members list
            fetchMembers();
        } catch (err) {
            console.error('Error deleting leadership member:', err);
            setError('Có lỗi xảy ra khi xóa thành viên. Vui lòng thử lại sau.');
        } finally {
            setIsLoading(false);
        }
    };

    // Open add/edit modal
    const openModal = (member?: LeadershipMember) => {
        if (member) {
            setCurrentMember(member);
            setImagePreview(member.imageData);
        } else {
            setCurrentMember({
                id: '',
                name: '',
                role: '',
                description: '',
                imageData: '',
                order: members.length,
                createdAt: new Date()
            });
            setImagePreview(null);
        }
        setImageFileSize('');
        setCompressedSize('');
        setShowModal(true);
    };

    return (
        <div className={styles.managerContainer}>
            <div className={styles.managerHeader}>
                <h2>Quản lý Ban Lãnh Đạo</h2>
                <div className={styles.headerActions}>
                    <button 
                        className={styles.addButton}
                        onClick={() => openModal()}
                    >
                        <i className="fas fa-plus"></i>
                        Thêm thành viên mới
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
            ) : members.length === 0 ? (
                <div className={styles.emptyState}>
                    <i className="fas fa-users"></i>
                    <p>Chưa có thành viên nào trong ban lãnh đạo. Bắt đầu bằng cách thêm thành viên mới!</p>
                    <button 
                        className={styles.addButtonLarge}
                        onClick={() => openModal()}
                    >
                        <i className="fas fa-plus-circle"></i>
                        Thêm thành viên đầu tiên
                    </button>
                </div>
            ) : (
                <div className={styles.leadershipGrid}>
                    {members.map(member => (
                        <div key={member.id} className={styles.leadershipCard}>
                            <div className={styles.leadershipImageContainer}>
                                <img 
                                    src={member.imageData}
                                    alt={member.name} 
                                    className={styles.leadershipImage}
                                    onError={(e) => {
                                        const target = e.target as HTMLImageElement;
                                        target.src = '/img/avatar-placeholder.png';
                                    }}
                                />
                                <div className={styles.leadershipOrder}>{member.order + 1}</div>
                            </div>
                            <div className={styles.leadershipContent}>
                                <h3 className={styles.leadershipName}>{member.name}</h3>
                                <div className={styles.leadershipRole}>{member.role}</div>
                                {member.description && (
                                    <p className={styles.leadershipDescription}>{member.description}</p>
                                )}
                            </div>
                            <div className={styles.leadershipActions}>
                                <button 
                                    className={styles.editButton} 
                                    onClick={() => openModal(member)}
                                >
                                    <i className="fas fa-edit"></i>
                                    Sửa
                                </button>
                                <button 
                                    className={styles.deleteButton} 
                                    onClick={() => handleDelete(member)}
                                >
                                    <i className="fas fa-trash"></i>
                                    Xóa
                                </button>
                            </div>
                        </div>
                    ))}
                </div>
            )}

            {/* Modal for adding/editing member */}
            {showModal && (
                <div className={styles.modal}>
                    <div className={styles.modalContent}>
                        <div className={styles.modalHeader}>
                            <h3>{currentMember?.id ? 'Sửa thông tin thành viên' : 'Thêm thành viên mới'}</h3>
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
                                <div className={styles.formImageSection}>
                                    <div 
                                        className={styles.imageDropzone}
                                        onClick={() => fileInputRef.current?.click()}
                                    >
                                        {imagePreview ? (
                                            <img 
                                                src={imagePreview} 
                                                alt="Preview" 
                                                className={styles.imagePreviewLarge}
                                                onError={(e) => {
                                                    const target = e.target as HTMLImageElement;
                                                    target.src = '/img/avatar-placeholder.png';
                                                }}
                                            />
                                        ) : (
                                            <div className={styles.uploadPlaceholder}>
                                                <i className="fas fa-user-circle"></i>
                                                <p>Chọn hoặc kéo thả hình ảnh</p>
                                                <span>Nên dùng ảnh vuông</span>
                                            </div>
                                        )}
                                        
                                        <input 
                                            ref={fileInputRef}
                                            type="file" 
                                            accept="image/*" 
                                            onChange={handleImageChange}
                                            style={{ display: 'none' }}
                                        />
                                    </div>
                                    
                                    <div className={styles.imageMeta}>
                                        {imageFile && (
                                            <div className={styles.fileName}>
                                                <i className="fas fa-file-image"></i>
                                                {imageFile.name}
                                                {imageFileSize && (
                                                    <span className={styles.fileSize}>
                                                        <i className="fas fa-compress-arrows-alt"></i>
                                                        {imageFileSize} {compressedSize && `→ ~${compressedSize}`}
                                                    </span>
                                                )}
                                            </div>
                                        )}
                                        
                                        <button 
                                            type="button"
                                            className={styles.browseButton}
                                            onClick={() => fileInputRef.current?.click()}
                                        >
                                            <i className="fas fa-folder-open"></i>
                                            Chọn hình ảnh
                                        </button>
                                    </div>

                                    <div className={styles.imageUploadNote}>
                                        <p>
                                            <strong>Lưu ý:</strong> Ảnh sẽ được tự động nén xuống kích thước tối đa 2MB
                                            để tối ưu hiệu suất. Nếu chọn ảnh lớn, chất lượng có thể giảm.
                                        </p>
                                    </div>
                                </div>
                                
                                <div className={styles.formFieldsSection}>
                                    <div className={styles.formGroup}>
                                        <label htmlFor="leaderName">
                                            <i className="fas fa-user"></i>
                                            Họ và tên
                                        </label>
                                        <input 
                                            id="leaderName"
                                            type="text" 
                                            value={currentMember?.name || ''} 
                                            onChange={(e) => setCurrentMember(prev => 
                                                prev ? {...prev, name: e.target.value} : null
                                            )}
                                            placeholder="Nhập họ và tên thành viên"
                                            required
                                            className={styles.formInput}
                                        />
                                    </div>
                                    
                                    <div className={styles.formGroup}>
                                        <label htmlFor="leaderRole">
                                            <i className="fas fa-user-tag"></i>
                                            Chức vụ
                                        </label>
                                        <input 
                                            id="leaderRole"
                                            type="text" 
                                            value={currentMember?.role || ''} 
                                            onChange={(e) => setCurrentMember(prev => 
                                                prev ? {...prev, role: e.target.value} : null
                                            )}
                                            placeholder="Nhập chức vụ (ví dụ: Chủ nhiệm, Phó Chủ nhiệm...)"
                                            required
                                            className={styles.formInput}
                                        />
                                    </div>
                                    
                                    <div className={styles.formGroup}>
                                        <label htmlFor="leaderDescription">
                                            <i className="fas fa-align-left"></i>
                                            Mô tả
                                        </label>
                                        <textarea 
                                            id="leaderDescription"
                                            value={currentMember?.description || ''} 
                                            onChange={(e) => setCurrentMember(prev => 
                                                prev ? {...prev, description: e.target.value} : null
                                            )}
                                            placeholder="Nhập thông tin giới thiệu ngắn gọn (kinh nghiệm, thành tựu...)"
                                            className={styles.formTextarea}
                                            rows={4}
                                        />
                                    </div>
                                    
                                    <div className={styles.formGroup}>
                                        <label htmlFor="leaderOrder">
                                            <i className="fas fa-sort-numeric-down"></i>
                                            Thứ tự hiển thị
                                        </label>
                                        <input 
                                            id="leaderOrder"
                                            type="number" 
                                            min="0"
                                            value={currentMember?.order || 0} 
                                            onChange={(e) => setCurrentMember(prev => 
                                                prev ? {...prev, order: parseInt(e.target.value)} : null
                                            )}
                                            required
                                            className={styles.formInput}
                                        />
                                        <small>Số thấp hơn sẽ hiển thị trước</small>
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
                                    ) : currentMember?.id ? 'Cập nhật thành viên' : 'Thêm thành viên mới'}
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

export default LeadershipManager;