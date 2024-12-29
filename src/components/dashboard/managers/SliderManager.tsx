import React, { useState } from 'react';
import styles from '../Dashboard.module.scss';

interface SliderItem {
    id: number;
    title: string;
    description: string;
    imageUrl: string;
}

const SliderManager: React.FC = () => {
    const [sliders, setSliders] = useState<SliderItem[]>([]);
    const [currentSlider, setCurrentSlider] = useState<SliderItem | null>(null);

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        // Add logic to save slider
    };

    return (
        <div className={styles.managerContainer}>
            <h2>Quản lý Slider</h2>
            
            <div className={styles.managerContent}>
                <div className={styles.formSection}>
                    <h3>Thêm/Sửa Slider</h3>
                    <form onSubmit={handleSubmit}>
                        <div className={styles.formGroup}>
                            <label>Tiêu đề</label>
                            <input 
                                type="text" 
                                value={currentSlider?.title || ''} 
                                onChange={(e) => setCurrentSlider(prev => 
                                    prev ? {...prev, title: e.target.value} : null
                                )}
                            />
                        </div>
                        <div className={styles.formGroup}>
                            <label>Mô tả</label>
                            <textarea 
                                value={currentSlider?.description || ''} 
                                onChange={(e) => setCurrentSlider(prev => 
                                    prev ? {...prev, description: e.target.value} : null
                                )}
                            />
                        </div>
                        <div className={styles.formGroup}>
                            <label>Hình ảnh</label>
                            <input type="file" accept="image/*" />
                        </div>
                        <button type="submit" className={styles.submitButton}>
                            {currentSlider ? 'Cập nhật' : 'Thêm mới'}
                        </button>
                    </form>
                </div>

                <div className={styles.listSection}>
                    <h3>Danh sách Slider</h3>
                    <div className={styles.sliderList}>
                        {sliders.map(slider => (
                            <div key={slider.id} className={styles.sliderItem}>
                                <img src={slider.imageUrl} alt={slider.title} />
                                <div className={styles.sliderInfo}>
                                    <h4>{slider.title}</h4>
                                    <p>{slider.description}</p>
                                </div>
                                <div className={styles.actions}>
                                    <button onClick={() => setCurrentSlider(slider)}>
                                        Sửa
                                    </button>
                                    <button onClick={() => {
                                        // Add delete logic
                                    }}>
                                        Xóa
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

export default SliderManager; 