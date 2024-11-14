class SettingsManager {
    static DEFAULTS = {
        theme: 'DEFAULT',
        notifications: {
            enabled: true,
            types: {
                anniversary: true,
                memory: true,
                calendar: true,
                fight: true
            },
            advanceTime: {
                days: 1,
                hours: 0
            }
        },
        display: {
            showLunar: true,
            showFestivals: true,
            timeFormat: '24h'
        },
        privacy: {
            autoLock: false,
            lockTimeout: 5, // minutes
            requirePassword: false,
            password: ''
        },
        backup: {
            autoBackup: false,
            backupInterval: 7, // days
            lastBackup: null
        }
    };

    constructor() {
        this.settings = this.loadSettings();
        this.init();
    }

    init() {
        // 监听设置变化
        window.eventBus.on('settingsChanged', (settings) => {
            this.saveSettings(settings);
        });

        // 创建设置面板
        this.createSettingsPanel();
    }

    loadSettings() {
        try {
            const savedSettings = localStorage.getItem('appSettings');
            return savedSettings ? 
                this.mergeSettings(JSON.parse(savedSettings)) : 
                {...SettingsManager.DEFAULTS};
        } catch (error) {
            console.error('加载设置失败:', error);
            return {...SettingsManager.DEFAULTS};
        }
    }

    mergeSettings(saved) {
        // 递归合并设置，确保所有默认值都存在
        const merged = {...SettingsManager.DEFAULTS};
        for (const [key, value] of Object.entries(saved)) {
            if (value && typeof value === 'object' && !Array.isArray(value)) {
                merged[key] = this.mergeSettings({
                    ...SettingsManager.DEFAULTS[key],
                    ...value
                });
            } else {
                merged[key] = value;
            }
        }
        return merged;
    }

    saveSettings(settings = this.settings) {
        try {
            localStorage.setItem('appSettings', JSON.stringify(settings));
            this.settings = settings;
            window.eventBus.emit('settingsUpdated', settings);
        } catch (error) {
            console.error('保存设置失败:', error);
            UIManager.showToast('设置保存失败', 'error');
        }
    }

    createSettingsPanel() {
        const panel = document.createElement('div');
        panel.className = 'settings-panel';
        panel.innerHTML = `
            <div class="settings-content">
                <h2>设置</h2>
                <div class="settings-sections">
                    ${this.createThemeSection()}
                    ${this.createNotificationSection()}
                    ${this.createDisplaySection()}
                    ${this.createPrivacySection()}
                    ${this.createBackupSection()}
                </div>
                <div class="settings-footer">
                    <button class="save-settings">保存设置</button>
                    <button class="reset-settings">重置设置</button>
                </div>
            </div>
        `;

        this.bindSettingsEvents(panel);
        return panel;
    }

    createThemeSection() {
        return `
            <section class="settings-section">
                <h3>主题设置</h3>
                <div class="setting-item">
                    <label>主题选择</label>
                    <select name="theme">
                        <option value="DEFAULT" ${this.settings.theme === 'DEFAULT' ? 'selected' : ''}>默认主题</option>
                        <option value="DARK" ${this.settings.theme === 'DARK' ? 'selected' : ''}>暗色主题</option>
                    </select>
                </div>
            </section>
        `;
    }

    createNotificationSection() {
        return `
            <section class="settings-section">
                <h3>通知设置</h3>
                <div class="setting-item">
                    <label>启用通知</label>
                    <input type="checkbox" name="notifications.enabled" 
                        ${this.settings.notifications.enabled ? 'checked' : ''}>
                </div>
                <div class="setting-item">
                    <label>提前提醒时间</label>
                    <div class="time-inputs">
                        <input type="number" name="notifications.advanceTime.days" 
                            value="${this.settings.notifications.advanceTime.days}" min="0"> 天
                        <input type="number" name="notifications.advanceTime.hours" 
                            value="${this.settings.notifications.advanceTime.hours}" min="0" max="23"> 小时
                    </div>
                </div>
            </section>
        `;
    }

    createDisplaySection() {
        return `
            <section class="settings-section">
                <h3>显示设置</h3>
                <div class="setting-item">
                    <label>显示农历</label>
                    <input type="checkbox" name="display.showLunar" 
                        ${this.settings.display.showLunar ? 'checked' : ''}>
                </div>
                <div class="setting-item">
                    <label>显示节日</label>
                    <input type="checkbox" name="display.showFestivals" 
                        ${this.settings.display.showFestivals ? 'checked' : ''}>
                </div>
            </section>
        `;
    }

    createPrivacySection() {
        return `
            <section class="settings-section">
                <h3>隐私设置</h3>
                <div class="setting-item">
                    <label>自动锁定</label>
                    <input type="checkbox" name="privacy.autoLock" 
                        ${this.settings.privacy.autoLock ? 'checked' : ''}>
                </div>
                <div class="setting-item">
                    <label>锁定时间（分钟）</label>
                    <input type="number" name="privacy.lockTimeout" 
                        value="${this.settings.privacy.lockTimeout}" min="1">
                </div>
            </section>
        `;
    }

    createBackupSection() {
        return `
            <section class="settings-section">
                <h3>备份设置</h3>
                <div class="setting-item">
                    <label>自动备份</label>
                    <input type="checkbox" name="backup.autoBackup" 
                        ${this.settings.backup.autoBackup ? 'checked' : ''}>
                </div>
                <div class="setting-item">
                    <label>备份间隔（天）</label>
                    <input type="number" name="backup.backupInterval" 
                        value="${this.settings.backup.backupInterval}" min="1">
                </div>
                <div class="setting-item">
                    <button class="backup-now">立即备份</button>
                    <button class="restore-backup">恢复备份</button>
                </div>
            </section>
        `;
    }

    bindSettingsEvents(panel) {
        // 保存设置
        panel.querySelector('.save-settings').onclick = () => {
            const newSettings = this.collectFormData(panel);
            this.saveSettings(newSettings);
            UIManager.showToast('设置已保存', 'success');
        };

        // 重置设置
        panel.querySelector('.reset-settings').onclick = () => {
            if (confirm('确定要重置所有设置吗？')) {
                this.settings = {...SettingsManager.DEFAULTS};
                this.saveSettings();
                UIManager.showToast('设置已重置', 'success');
            }
        };

        // 立即备份
        panel.querySelector('.backup-now').onclick = () => {
            DataManager.exportData();
        };

        // 恢复备份
        panel.querySelector('.restore-backup').onclick = () => {
            // 创建文件输入元素
            const input = document.createElement('input');
            input.type = 'file';
            input.accept = '.json';
            input.onchange = async (e) => {
                const file = e.target.files[0];
                if (file) {
                    await DataManager.importData(file);
                }
            };
            input.click();
        };
    }

    collectFormData(panel) {
        const newSettings = {...this.settings};
        panel.querySelectorAll('input, select').forEach(input => {
            const path = input.name.split('.');
            let current = newSettings;
            
            for (let i = 0; i < path.length - 1; i++) {
                current = current[path[i]];
            }

            const value = input.type === 'checkbox' ? input.checked :
                         input.type === 'number' ? Number(input.value) :
                         input.value;
            
            current[path[path.length - 1]] = value;
        });
        return newSettings;
    }

    // 获取设置值
    getSetting(path) {
        return path.split('.').reduce((obj, key) => obj?.[key], this.settings);
    }

    // 更新单个设置
    updateSetting(path, value) {
        const keys = path.split('.');
        const lastKey = keys.pop();
        const target = keys.reduce((obj, key) => obj[key], this.settings);
        target[lastKey] = value;
        this.saveSettings();
    }
}

// 初始化设置管理器
document.addEventListener('DOMContentLoaded', () => {
    window.settingsManager = new SettingsManager();
}); 