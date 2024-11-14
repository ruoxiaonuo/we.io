class ErrorHandler {
    static showError(message, duration = 3000) {
        const errorDiv = document.createElement('div');
        errorDiv.className = 'error-message';
        errorDiv.innerHTML = `
            <div class="error-content">
                <span class="error-icon">❌</span>
                <span class="error-text">${message}</span>
            </div>
        `;
        
        document.body.appendChild(errorDiv);
        
        // 添加动画
        requestAnimationFrame(() => {
            errorDiv.style.opacity = '1';
            errorDiv.style.transform = 'translateY(0)';
        });
        
        // 自动移除
        setTimeout(() => {
            errorDiv.style.opacity = '0';
            errorDiv.style.transform = 'translateY(20px)';
            setTimeout(() => errorDiv.remove(), CONFIG.ANIMATION.DURATION);
        }, duration);
    }

    static handleApiError(error) {
        console.error('API Error:', error);
        this.showError(error.message || CONFIG.MESSAGES.ERROR.LOAD_FAILED);
    }

    static handleStorageError(error) {
        console.error('Storage Error:', error);
        this.showError(CONFIG.MESSAGES.ERROR.SAVE_FAILED);
    }
} 