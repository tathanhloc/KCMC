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

interface SliderItem {
    id: string;
    title: string;
    description: string;
    imageUrl: string;
    order: number;
    createdAt: Date;
}

interface SliderManagerProps {
    userRole: UserRole;
}

const SliderManager: React.FC<SliderManagerProps> = ({ userRole }) => {
    const [sliders, setSliders] = useState<SliderItem[]>([]);
    const [currentSlider, setCurrentSlider] = useState<SliderItem | null>(null);
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [success, setSuccess] = useState<string | null>(null);
    const [showModal, setShowModal] = useState(false);
    const [imageUrl, setImageUrl] = useState<string>('');
    const [imagePreview, setImagePreview] = useState<string | null>(null);

    // Firebase references
    const db = getFirestore();
    const slidersCollection = collection(db, 'sliders');

    // Fetch sliders on component mount
    useEffect(() => {
        fetchSliders();
    }, []);

    // Function to fetch sliders from Firestore
    const fetchSliders = async () => {
        setIsLoading(true);
        setError(null);
        try {
            const q = query(slidersCollection, orderBy('order', 'asc'));
            const querySnapshot = await getDocs(q);
            
            const slidersData: SliderItem[] = [];
            querySnapshot.forEach((doc) => {
                const data = doc.data();
                slidersData.push({
                    id: doc.id,
                    title: data.title,
                    description: data.description,
                    imageUrl: data.imageUrl,
                    order: data.order,
                    createdAt: data.createdAt.toDate()
                });
            });
            
            setSliders(slidersData);
        } catch (err) {
            console.error('Error fetching sliders:', err);
            setError('Không thể tải dữ liệu slider. Vui lòng thử lại sau.');
        } finally {
            setIsLoading(false);
        }
    };

    // Handle image URL input change
    const handleImageUrlChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const url = e.target.value;
        setImageUrl(url);
        setImagePreview(url);
    };

    // Reset form and states
    const resetForm = () => {
        setCurrentSlider(null);
        setImageUrl('');
        setImagePreview(null);
        setShowModal(false);
        setError(null);
        setSuccess(null);
    };

    // Handle form submission (add/update slider)
    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsLoading(true);
        setError(null);
        setSuccess(null);

        if (!currentSlider?.title || !currentSlider?.description) {
            setError('Vui lòng điền đầy đủ thông tin.');
            setIsLoading(false);
            return;
        }

        // Get the image URL from state
        const finalImageUrl = imageUrl || currentSlider.imageUrl;

        if (!finalImageUrl) {
            setError('Vui lòng nhập URL hình ảnh cho slider.');
            setIsLoading(false);
            return;
        }

        try {
            // Check if image URL is valid
            const imgTest = new Image();
            imgTest.onload = async () => {
                // Image is valid, proceed with saving
                if (currentSlider.id) {
                    // Update existing slider
                    const sliderRef = doc(db, 'sliders', currentSlider.id);
                    await updateDoc(sliderRef, {
                        title: currentSlider.title,
                        description: currentSlider.description,
                        imageUrl: finalImageUrl,
                        order: currentSlider.order || sliders.length,
                        updatedAt: new Date()
                    });
                    setSuccess('Slider đã được cập nhật thành công!');
                } else {
                    // Add new slider
                    await addDoc(slidersCollection, {
                        title: currentSlider.title,
                        description: currentSlider.description,
                        imageUrl: finalImageUrl,
                        order: sliders.length,
                        createdAt: new Date(),
                        updatedAt: new Date()
                    });
                    setSuccess('Slider đã được thêm thành công!');
                }

                // Refresh the slider list
                fetchSliders();
                
                // Close modal after short delay
                setTimeout(() => {
                    resetForm();
                }, 1500);
            };

            imgTest.onerror = () => {
                setError('URL hình ảnh không hợp lệ. Vui lòng kiểm tra lại.');
                setIsLoading(false);
            };

            imgTest.src = finalImageUrl;
            
        } catch (err) {
            console.error('Error saving slider:', err);
            setError('Có lỗi xảy ra khi lưu slider. Vui lòng thử lại sau.');
            setIsLoading(false);
        }
    };

    // Handle slider deletion
    const handleDelete = async (slider: SliderItem) => {
        if (!window.confirm(`Bạn có chắc chắn muốn xóa slider "${slider.title}"?`)) {
            return;
        }

        setIsLoading(true);
        try {
            // Delete the slider document
            await deleteDoc(doc(db, 'sliders', slider.id));
            
            setSuccess('Slider đã được xóa thành công!');
            
            // Refresh the slider list
            fetchSliders();
        } catch (err) {
            console.error('Error deleting slider:', err);
            setError('Có lỗi xảy ra khi xóa slider. Vui lòng thử lại sau.');
        } finally {
            setIsLoading(false);
        }
    };

    // Open add/edit modal
    const openModal = (slider?: SliderItem) => {
        if (slider) {
            setCurrentSlider(slider);
            setImageUrl(slider.imageUrl);
            setImagePreview(slider.imageUrl);
        } else {
            setCurrentSlider({
                id: '',
                title: '',
                description: '',
                imageUrl: '',
                order: sliders.length,
                createdAt: new Date()
            });
            setImageUrl('');
            setImagePreview(null);
        }
        setShowModal(true);
    };

    return (
        <div className={styles.managerContainer}>
            <div className={styles.managerHeader}>
                <h2>Quản lý Slider</h2>
                <div className={styles.headerActions}>
                    <button 
                        className={styles.addButton}
                        onClick={() => openModal()}
                    >
                        <i className="fas fa-plus"></i>
                        Thêm slider mới
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
            ) : sliders.length === 0 ? (
                <div className={styles.emptyState}>
                    <i className="fas fa-images"></i>
                    <p>Chưa có slider nào. Bắt đầu bằng cách thêm slider mới!</p>
                    <button 
                        className={styles.addButtonLarge}
                        onClick={() => openModal()}
                    >
                        <i className="fas fa-plus-circle"></i>
                        Thêm slider đầu tiên
                    </button>
                </div>
            ) : (
                <div className={styles.sliderGrid}>
                    {sliders.map(slider => (
                        <div key={slider.id} className={styles.sliderCard}>
                            <div className={styles.sliderImageContainer}>
                                <img src={slider.imageUrl} alt={slider.title} className={styles.sliderImage} />
                                <div className={styles.sliderOverlay}>
                                    <button 
                                        className={styles.editButton} 
                                        onClick={() => openModal(slider)}
                                    >
                                        <i className="fas fa-edit"></i>
                                        Sửa
                                    </button>
                                    <button 
                                        className={styles.deleteButton} 
                                        onClick={() => handleDelete(slider)}
                                    >
                                        <i className="fas fa-trash"></i>
                                        Xóa
                                    </button>
                                </div>
                                <div className={styles.sliderOrder}>{slider.order + 1}</div>
                            </div>
                            <div className={styles.sliderContent}>
                                <h3 className={styles.sliderTitle}>{slider.title}</h3>
                                <p className={styles.sliderDescription}>{slider.description}</p>
                                <div className={styles.sliderDate}>
                                    <i className="far fa-calendar-alt"></i>
                                    {slider.createdAt.toLocaleDateString('vi-VN')}
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            )}

            {/* Modal for adding/editing slider */}
            {showModal && (
                <div className={styles.modal}>
                    <div className={styles.modalContent}>
                        <div className={styles.modalHeader}>
                            <h3>{currentSlider?.id ? 'Sửa Slider' : 'Thêm Slider Mới'}</h3>
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
                                    <div className={styles.imagePreviewContainer}>
                                        {imagePreview ? (
                                            <img 
                                                src={imagePreview} 
                                                alt="Preview" 
                                                className={styles.imagePreviewLarge}
                                                onError={() => {
                                                    setImagePreview('/placeholder-image.jpg');
                                                    setError('Không thể tải hình ảnh từ URL đã nhập');
                                                }}
                                            />
                                        ) : (
                                            <div className={styles.uploadPlaceholder}>
                                                <i className="fas fa-image"></i>
                                                <p>Nhập URL hình ảnh để xem trước</p>
                                            </div>
                                        )}
                                    </div>
                                    
                                    <div className={styles.formGroup}>
                                        <label htmlFor="imageUrl">
                                            <i className="fas fa-link"></i>
                                            URL Hình ảnh
                                        </label>
                                        <input 
                                            id="imageUrl"
                                            type="url" 
                                            value={imageUrl}
                                            onChange={handleImageUrlChange}
                                            placeholder="Nhập URL hình ảnh (ví dụ: https://example.com/image.jpg)"
                                            className={styles.formInput}
                                            required
                                        />
                                        <small>Sử dụng URL hình ảnh từ internet (jpeg, png, webp)</small>
                                    </div>
                                    
                                    <div className={styles.imageTips}>
                                        <h4>Gợi ý:</h4>
                                        <ul>
                                            <li>Sử dụng hình ảnh có tỷ lệ 16:9</li>
                                            <li>Độ phân giải tối thiểu 1200x675px</li>
                                            <li>Chọn hình ảnh dung lượng nhỏ để tải nhanh hơn</li>
                                            <li>Đảm bảo URL hình ảnh hoạt động lâu dài</li>
                                        </ul>
                                    </div>
                                </div>
                                
                                <div className={styles.formFieldsSection}>
                                    <div className={styles.formGroup}>
                                        <label htmlFor="sliderTitle">
                                            <i className="fas fa-heading"></i>
                                            Tiêu đề
                                        </label>
                                        <input 
                                            id="sliderTitle"
                                            type="text" 
                                            value={currentSlider?.title || ''} 
                                            onChange={(e) => setCurrentSlider(prev => 
                                                prev ? {...prev, title: e.target.value} : null
                                            )}
                                            placeholder="Nhập tiêu đề cho slider"
                                            required
                                            className={styles.formInput}
                                        />
                                    </div>
                                    
                                    <div className={styles.formGroup}>
                                        <label htmlFor="sliderDescription">
                                            <i className="fas fa-align-left"></i>
                                            Mô tả
                                        </label>
                                        <textarea 
                                            id="sliderDescription"
                                            value={currentSlider?.description || ''} 
                                            onChange={(e) => setCurrentSlider(prev => 
                                                prev ? {...prev, description: e.target.value} : null
                                            )}
                                            placeholder="Nhập mô tả ngắn gọn cho slider"
                                            required
                                            className={styles.formTextarea}
                                            rows={4}
                                        />
                                    </div>
                                    
                                    <div className={styles.formGroup}>
                                        <label htmlFor="sliderOrder">
                                            <i className="fas fa-sort-numeric-down"></i>
                                            Thứ tự hiển thị
                                        </label>
                                        <input 
                                            id="sliderOrder"
                                            type="number" 
                                            min="0"
                                            value={currentSlider?.order || 0} 
                                            onChange={(e) => setCurrentSlider(prev => 
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
                                                {currentSlider?.title || 'Tiêu đề slider'}
                                            </div>
                                            <div className={styles.previewDescription}>
                                                {currentSlider?.description || 'Mô tả slider sẽ xuất hiện ở đây'}
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
                                    ) : currentSlider?.id ? 'Cập nhật slider' : 'Thêm slider mới'}
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

export default SliderManager;