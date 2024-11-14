class LoadingManager {
    static show(message = '加载中...') {
        const loading = document.createElement('div');
        loading.className = 'loading-overlay';
        loading.innerHTML = `
            <div class="loading-content">
                <div class="loading-spinner"></div>
                <div class="loading-text">${message}</div>
            </div>
        `;
        
        document.body.appendChild(loading);
        
        // 添加动画
        requestAnimationFrame(() => {
            loading.style.opacity = '1';
        });
    }

    static hide() {
        const loading = document.querySelector('.loading-overlay');
        if (loading) {
            loading.style.opacity = '0';
            setTimeout(() => loading.remove(), CONFIG.ANIMATION.DURATION);
        }
    }
} 