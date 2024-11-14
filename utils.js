// 工具类
class Utils {
    // 日期格式化
    static formatDate(date, format = 'YYYY-MM-DD') {
        const year = date.getFullYear();
        const month = String(date.getMonth() + 1).padStart(2, '0');
        const day = String(date.getDate()).padStart(2, '0');
        
        return format
            .replace('YYYY', year)
            .replace('MM', month)
            .replace('DD', day);
    }

    // 本地存储封装
    static storage = {
        set(key, value) {
            try {
                localStorage.setItem(key, JSON.stringify(value));
            } catch (error) {
                console.error('存储数据失败:', error);
            }
        },
        
        get(key, defaultValue = null) {
            try {
                const value = localStorage.getItem(key);
                return value ? JSON.parse(value) : defaultValue;
            } catch (error) {
                console.error('读取数据失败:', error);
                return defaultValue;
            }
        },
        
        remove(key) {
            localStorage.removeItem(key);
        }
    };

    // 创建模态框
    static createModal(options) {
        const modal = document.createElement('div');
        modal.className = 'modal';
        modal.innerHTML = `
            <div class="modal-content">
                <span class="close-btn">&times;</span>
                <h3>${options.title}</h3>
                <div class="modal-body">
                    ${options.content}
                </div>
            </div>
        `;

        // 绑定关闭事件
        const closeBtn = modal.querySelector('.close-btn');
        closeBtn.onclick = () => modal.remove();
        
        // 点击外部关闭
        modal.onclick = (e) => {
            if (e.target === modal) {
                modal.remove();
            }
        };

        document.body.appendChild(modal);
        return modal;
    }

    // 图片处理
    static handleImage(file, maxSize = 1024 * 1024) {
        return new Promise((resolve, reject) => {
            if (file.size > maxSize) {
                const reader = new FileReader();
                reader.onload = (e) => {
                    const img = new Image();
                    img.onload = () => {
                        const canvas = document.createElement('canvas');
                        let width = img.width;
                        let height = img.height;
                        
                        // 计算缩放比例
                        const ratio = Math.sqrt(maxSize / file.size);
                        width *= ratio;
                        height *= ratio;
                        
                        canvas.width = width;
                        canvas.height = height;
                        
                        const ctx = canvas.getContext('2d');
                        ctx.drawImage(img, 0, 0, width, height);
                        
                        canvas.toBlob((blob) => {
                            resolve(blob);
                        }, file.type, 0.9);
                    };
                    img.src = e.target.result;
                };
                reader.readAsDataURL(file);
            } else {
                resolve(file);
            }
        });
    }

    // 错误处理
    static showError(message, duration = 3000) {
        const errorDiv = document.createElement('div');
        errorDiv.className = 'error-message';
        errorDiv.textContent = message;
        
        document.body.appendChild(errorDiv);
        
        setTimeout(() => {
            errorDiv.remove();
        }, duration);
    }

    // 加载状态
    static loading = {
        show() {
            const loading = document.createElement('div');
            loading.className = 'loading';
            loading.innerHTML = '<div class="spinner"></div>';
            document.body.appendChild(loading);
        },
        
        hide() {
            const loading = document.querySelector('.loading');
            if (loading) {
                loading.remove();
            }
        }
    };
} 