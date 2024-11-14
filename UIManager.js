class UIManager {
    static showModal(options) {
        const modal = document.createElement('div');
        modal.className = 'modal';
        modal.innerHTML = `
            <div class="modal-content ${options.className || ''}">
                <span class="close-btn">&times;</span>
                <h3>${options.title}</h3>
                <div class="modal-body">
                    ${options.content}
                </div>
                ${options.footer ? `
                    <div class="modal-footer">
                        ${options.footer}
                    </div>
                ` : ''}
            </div>
        `;

        // 绑定关闭事件
        const closeModal = () => {
            modal.classList.add('modal-closing');
            setTimeout(() => modal.remove(), 300);
            options.onClose?.();
        };

        modal.querySelector('.close-btn').onclick = closeModal;
        modal.onclick = (e) => {
            if (e.target === modal) closeModal();
        };

        // 添加动画效果
        requestAnimationFrame(() => {
            document.body.appendChild(modal);
            requestAnimationFrame(() => {
                modal.classList.add('modal-show');
            });
        });

        return modal;
    }

    static showToast(message, type = 'info') {
        const toast = document.createElement('div');
        toast.className = `toast toast-${type}`;
        toast.innerHTML = `
            <div class="toast-content">
                <span class="toast-icon">${this.getToastIcon(type)}</span>
                <span class="toast-message">${message}</span>
            </div>
        `;

        document.body.appendChild(toast);
        requestAnimationFrame(() => {
            toast.classList.add('toast-show');
            setTimeout(() => {
                toast.classList.add('toast-hide');
                setTimeout(() => toast.remove(), 300);
            }, 3000);
        });
    }

    static getToastIcon(type) {
        const icons = {
            success: '✓',
            error: '✕',
            warning: '⚠',
            info: 'ℹ'
        };
        return icons[type] || icons.info;
    }

    static showConfirm(options) {
        return new Promise((resolve) => {
            const modal = this.showModal({
                title: options.title,
                content: options.message,
                className: 'confirm-modal',
                footer: `
                    <button class="btn btn-primary confirm-btn">${options.confirmText || '确定'}</button>
                    <button class="btn btn-secondary cancel-btn">${options.cancelText || '取消'}</button>
                `
            });

            modal.querySelector('.confirm-btn').onclick = () => {
                resolve(true);
                modal.remove();
            };

            modal.querySelector('.cancel-btn').onclick = () => {
                resolve(false);
                modal.remove();
            };
        });
    }

    static showLoading(message = '加载中...') {
        const loading = document.createElement('div');
        loading.className = 'loading-overlay';
        loading.innerHTML = `
            <div class="loading-content">
                <div class="loading-spinner"></div>
                <div class="loading-text">${message}</div>
            </div>
        `;

        document.body.appendChild(loading);
        return loading;
    }

    static hideLoading(loading) {
        if (loading) {
            loading.classList.add('loading-hide');
            setTimeout(() => loading.remove(), 300);
        }
    }
} 