class AudioManager {
    static SOUNDS = {
        CLICK: 'click.mp3',
        SUCCESS: 'success.mp3',
        ERROR: 'error.mp3',
        NOTIFICATION: 'notification.mp3',
        HOVER: 'hover.mp3'
    };

    constructor() {
        this.enabled = true;
        this.volume = 0.5;
        this.sounds = {};
        this.init();
    }

    init() {
        // 预加载所有音效
        Object.entries(AudioManager.SOUNDS).forEach(([key, file]) => {
            const audio = new Audio(`sounds/${file}`);
            audio.preload = 'auto';
            audio.volume = this.volume;
            this.sounds[key] = audio;
        });

        // 从本地存储加载设置
        const settings = localStorage.getItem('audioSettings');
        if (settings) {
            const { enabled, volume } = JSON.parse(settings);
            this.enabled = enabled;
            this.volume = volume;
            this.updateVolume(volume);
        }

        // 添加全局点击音效
        document.addEventListener('click', (e) => {
            if (e.target.matches('button, .btn, [role="button"]')) {
                this.playSound('CLICK');
            }
        });

        // 添加全局悬停音效
        document.addEventListener('mouseover', (e) => {
            if (e.target.matches('button, .btn, [role="button"]')) {
                this.playSound('HOVER');
            }
        });
    }

    playSound(soundKey) {
        if (!this.enabled) return;

        const sound = this.sounds[soundKey];
        if (sound) {
            // 克隆音频节点以支持重叠播放
            const clone = sound.cloneNode();
            clone.volume = this.volume;
            clone.play().catch(error => {
                console.warn('音频播放失败:', error);
            });

            // 播放完成后删除克隆节点
            clone.onended = () => clone.remove();
        }
    }

    updateVolume(volume) {
        this.volume = Math.max(0, Math.min(1, volume));
        Object.values(this.sounds).forEach(sound => {
            sound.volume = this.volume;
        });
        this.saveSettings();
    }

    toggle(enabled = !this.enabled) {
        this.enabled = enabled;
        this.saveSettings();
    }

    saveSettings() {
        localStorage.setItem('audioSettings', JSON.stringify({
            enabled: this.enabled,
            volume: this.volume
        }));
    }

    // 创建音频控制面板
    createControls() {
        const controls = document.createElement('div');
        controls.className = 'audio-controls';
        controls.innerHTML = `
            <div class="audio-panel">
                <label class="audio-toggle">
                    <input type="checkbox" ${this.enabled ? 'checked' : ''}>
                    <span class="toggle-label">音效</span>
                </label>
                <div class="volume-control">
                    <span class="volume-icon">🔊</span>
                    <input type="range" 
                           min="0" 
                           max="100" 
                           value="${this.volume * 100}"
                           class="volume-slider">
                </div>
            </div>
        `;

        // 绑定事件
        const toggle = controls.querySelector('input[type="checkbox"]');
        toggle.addEventListener('change', () => {
            this.toggle(toggle.checked);
        });

        const slider = controls.querySelector('.volume-slider');
        slider.addEventListener('input', () => {
            this.updateVolume(slider.value / 100);
        });

        return controls;
    }

    // 播放成功音效
    playSuccess() {
        this.playSound('SUCCESS');
    }

    // 播放错误音效
    playError() {
        this.playSound('ERROR');
    }

    // 播放通知音效
    playNotification() {
        this.playSound('NOTIFICATION');
    }
}

// 添加对应的CSS
const style = document.createElement('style');
style.textContent = `
    .audio-controls {
        position: fixed;
        bottom: 20px;
        right: 20px;
        z-index: 1000;
    }

    .audio-panel {
        background: white;
        padding: 10px 15px;
        border-radius: 25px;
        box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);
        display: flex;
        align-items: center;
        gap: 15px;
    }

    .audio-toggle {
        display: flex;
        align-items: center;
        gap: 5px;
        cursor: pointer;
    }

    .volume-control {
        display: flex;
        align-items: center;
        gap: 5px;
    }

    .volume-slider {
        width: 80px;
        height: 4px;
        -webkit-appearance: none;
        background: #eee;
        border-radius: 2px;
        outline: none;
    }

    .volume-slider::-webkit-slider-thumb {
        -webkit-appearance: none;
        width: 12px;
        height: 12px;
        background: #ff6b6b;
        border-radius: 50%;
        cursor: pointer;
    }

    .volume-icon {
        font-size: 1.2em;
        color: #666;
    }
`;

document.head.appendChild(style);

// 初始化音频管理器
document.addEventListener('DOMContentLoaded', () => {
    window.audioManager = new AudioManager();
    document.body.appendChild(window.audioManager.createControls());
}); 