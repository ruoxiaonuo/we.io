class Utils {
    // 日期处理
    static formatDate(date, format = 'YYYY-MM-DD') {
        const d = new Date(date);
        const year = d.getFullYear();
        const month = String(d.getMonth() + 1).padStart(2, '0');
        const day = String(d.getDate()).padStart(2, '0');
        const hours = String(d.getHours()).padStart(2, '0');
        const minutes = String(d.getMinutes()).padStart(2, '0');
        const seconds = String(d.getSeconds()).padStart(2, '0');

        return format
            .replace('YYYY', year)
            .replace('MM', month)
            .replace('DD', day)
            .replace('HH', hours)
            .replace('mm', minutes)
            .replace('ss', seconds);
    }

    // 时间差计算
    static getTimeDifference(startDate, endDate = new Date()) {
        const start = new Date(startDate).getTime();
        const end = new Date(endDate).getTime();
        const diff = Math.max(0, end - start);

        return {
            days: Math.floor(diff / (1000 * 60 * 60 * 24)),
            hours: Math.floor((diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60)),
            minutes: Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60)),
            seconds: Math.floor((diff % (1000 * 60)) / 1000)
        };
    }

    // 文件处理
    static async processImage(file) {
        return new Promise((resolve, reject) => {
            if (!CONFIG.VALIDATION.ALLOWED_IMAGE_TYPES.includes(file.type)) {
                reject(new Error('不支持的文件类型'));
                return;
            }

            if (file.size > CONFIG.VALIDATION.MAX_FILE_SIZE) {
                reject(new Error('文件大小超出限制'));
                return;
            }

            const reader = new FileReader();
            reader.onload = (e) => resolve(e.target.result);
            reader.onerror = (e) => reject(e);
            reader.readAsDataURL(file);
        });
    }

    // 数据处理
    static debounce(func, wait) {
        let timeout;
        return function executedFunction(...args) {
            const later = () => {
                clearTimeout(timeout);
                func(...args);
            };
            clearTimeout(timeout);
            timeout = setTimeout(later, wait);
        };
    }

    static throttle(func, limit) {
        let inThrottle;
        return function executedFunction(...args) {
            if (!inThrottle) {
                func(...args);
                inThrottle = true;
                setTimeout(() => inThrottle = false, limit);
            }
        };
    }

    // 字符串处理
    static truncate(str, length) {
        if (str.length <= length) return str;
        return str.slice(0, length) + '...';
    }

    // DOM 操作
    static createElement(tag, className, innerHTML = '') {
        const element = document.createElement(tag);
        if (className) element.className = className;
        if (innerHTML) element.innerHTML = innerHTML;
        return element;
    }

    // 动画
    static async animate(element, keyframes, options) {
        const animation = element.animate(keyframes, {
            duration: CONFIG.ANIMATION.DURATION.MEDIUM,
            easing: CONFIG.ANIMATION.EASING.DEFAULT,
            ...options
        });
        return animation.finished;
    }

    // 错误处理
    static handleError(error, silent = false) {
        console.error(error);
        if (!silent) {
            UIManager.showToast(error.message || '操作失败', 'error');
        }
    }

    // 本地存储
    static storage = {
        set(key, value) {
            try {
                localStorage.setItem(key, JSON.stringify(value));
                return true;
            } catch (error) {
                this.handleError(error);
                return false;
            }
        },

        get(key, defaultValue = null) {
            try {
                const value = localStorage.getItem(key);
                return value ? JSON.parse(value) : defaultValue;
            } catch (error) {
                this.handleError(error);
                return defaultValue;
            }
        },

        remove(key) {
            localStorage.removeItem(key);
        },

        clear() {
            localStorage.clear();
        }
    };
} 