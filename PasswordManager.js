class PasswordManager {
    static HASH_ITERATIONS = 1000;
    static LOCK_TIMEOUT = 5 * 60 * 1000; // 5分钟自动锁定
    
    constructor() {
        this.isLocked = false;
        this.lastActivity = Date.now();
        this.init();
    }

    init() {
        // 检查是否设置了密码
        const hasPassword = localStorage.getItem('hasPassword') === 'true';
        if (hasPassword) {
            this.lock();
        }

        // 监听用户活动
        document.addEventListener('mousemove', () => this.updateActivity());
        document.addEventListener('keydown', () => this.updateActivity());
        
        // 定期检查是否需要锁定
        setInterval(() => this.checkLockStatus(), 60000);

        // 监听设置变更
        window.eventBus.on('settingsUpdated', (settings) => {
            if (settings.privacy.autoLock) {
                this.startAutoLock();
            } else {
                this.stopAutoLock();
            }
        });
    }

    async setPassword(password) {
        try {
            const salt = crypto.getRandomValues(new Uint8Array(16));
            const hash = await this.hashPassword(password, salt);
            
            localStorage.setItem('passwordHash', hash);
            localStorage.setItem('passwordSalt', this.arrayToHex(salt));
            localStorage.setItem('hasPassword', 'true');
            
            return true;
        } catch (error) {
            console.error('设置密码失败:', error);
            return false;
        }
    }

    async verifyPassword(password) {
        try {
            const storedHash = localStorage.getItem('passwordHash');
            const salt = this.hexToArray(localStorage.getItem('passwordSalt'));
            const hash = await this.hashPassword(password, salt);
            
            return hash === storedHash;
        } catch (error) {
            console.error('验证密码失败:', error);
            return false;
        }
    }

    async hashPassword(password, salt) {
        const encoder = new TextEncoder();
        const data = encoder.encode(password);
        
        const hashBuffer = await crypto.subtle.digest(
            'SHA-256',
            new Uint8Array([...salt, ...data])
        );
        
        return this.arrayToHex(new Uint8Array(hashBuffer));
    }

    arrayToHex(array) {
        return Array.from(array)
            .map(b => b.toString(16).padStart(2, '0'))
            .join('');
    }

    hexToArray(hex) {
        const array = new Uint8Array(hex.length / 2);
        for (let i = 0; i < hex.length; i += 2) {
            array[i / 2] = parseInt(hex.substr(i, 2), 16);
        }
        return array;
    }

    lock() {
        this.isLocked = true;
        this.showLockScreen();
    }

    async unlock(password) {
        if (await this.verifyPassword(password)) {
            this.isLocked = false;
            this.hideLockScreen();
            this.updateActivity();
            return true;
        }
        return false;
    }

    updateActivity() {
        this.lastActivity = Date.now();
    }

    checkLockStatus() {
        if (!this.isLocked && 
            window.settingsManager.getSetting('privacy.autoLock') &&
            Date.now() - this.lastActivity > PasswordManager.LOCK_TIMEOUT) {
            this.lock();
        }
    }

    showLockScreen() {
        const lockScreen = document.createElement('div');
        lockScreen.className = 'lock-screen';
        lockScreen.innerHTML = `
            <div class="lock-content">
                <h2>🔒 已锁定</h2>
                <div class="password-form">
                    <input type="password" id="unlockPassword" 
                           placeholder="请输入密码" class="password-input">
                    <button id="unlockButton" class="unlock-btn">解锁</button>
                </div>
            </div>
        `;

        document.body.appendChild(lockScreen);

        const unlockButton = document.getElementById('unlockButton');
        const passwordInput = document.getElementById('unlockPassword');

        unlockButton.onclick = async () => {
            const password = passwordInput.value;
            if (await this.unlock(password)) {
                lockScreen.remove();
            } else {
                passwordInput.value = '';
                passwordInput.classList.add('error');
                setTimeout(() => passwordInput.classList.remove('error'), 1000);
            }
        };

        passwordInput.onkeypress = (e) => {
            if (e.key === 'Enter') {
                unlockButton.click();
            }
        };
    }

    hideLockScreen() {
        const lockScreen = document.querySelector('.lock-screen');
        if (lockScreen) {
            lockScreen.remove();
        }
    }

    startAutoLock() {
        this.autoLockInterval = setInterval(() => this.checkLockStatus(), 60000);
    }

    stopAutoLock() {
        if (this.autoLockInterval) {
            clearInterval(this.autoLockInterval);
        }
    }
}

// 添加对应的CSS
const style = document.createElement('style');
style.textContent = `
    .lock-screen {
        position: fixed;
        top: 0;
        left: 0;
        width: 100%;
        height: 100%;
        background: rgba(255, 107, 107, 0.95);
        display: flex;
        justify-content: center;
        align-items: center;
        z-index: 10000;
    }

    .lock-content {
        background: white;
        padding: 40px;
        border-radius: 20px;
        text-align: center;
        box-shadow: 0 10px 30px rgba(0, 0, 0, 0.2);
    }

    .password-form {
        margin-top: 30px;
    }

    .password-input {
        padding: 12px 20px;
        border: 2px solid #eee;
        border-radius: 25px;
        font-size: 16px;
        width: 250px;
        margin-bottom: 15px;
        transition: all 0.3s ease;
    }

    .password-input:focus {
        outline: none;
        border-color: #ff6b6b;
    }

    .password-input.error {
        border-color: #ff4f4f;
        animation: shake 0.5s;
    }

    .unlock-btn {
        background: #ff6b6b;
        color: white;
        border: none;
        padding: 12px 30px;
        border-radius: 25px;
        font-size: 16px;
        cursor: pointer;
        transition: all 0.3s ease;
    }

    .unlock-btn:hover {
        background: #ff5252;
        transform: translateY(-2px);
    }

    @keyframes shake {
        0%, 100% { transform: translateX(0); }
        25% { transform: translateX(-10px); }
        75% { transform: translateX(10px); }
    }
`;

document.head.appendChild(style);

// 初始化密码管理器
document.addEventListener('DOMContentLoaded', () => {
    window.passwordManager = new PasswordManager();
}); 