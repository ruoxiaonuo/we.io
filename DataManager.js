class DataManager {
    static KEYS = {
        MEMORIES: 'memories',
        PHOTOS: 'photos',
        FIGHTS: 'fights',
        CALENDAR: 'calendarEvents'
    };

    static save(key, data) {
        try {
            const serializedData = JSON.stringify(data);
            localStorage.setItem(key, serializedData);
            return true;
        } catch (error) {
            console.error('数据保存失败:', error);
            UIManager.showToast('保存失败，请重试', 'error');
            return false;
        }
    }

    static load(key, defaultValue = null) {
        try {
            const data = localStorage.getItem(key);
            return data ? JSON.parse(data) : defaultValue;
        } catch (error) {
            console.error('数据读取失败:', error);
            UIManager.showToast('数据加载失败', 'error');
            return defaultValue;
        }
    }

    static update(key, updateFn) {
        const data = this.load(key, []);
        const updatedData = updateFn(data);
        return this.save(key, updatedData);
    }

    static delete(key) {
        try {
            localStorage.removeItem(key);
            return true;
        } catch (error) {
            console.error('数据删除失败:', error);
            return false;
        }
    }

    static clear() {
        try {
            localStorage.clear();
            return true;
        } catch (error) {
            console.error('数据清除失败:', error);
            return false;
        }
    }

    // 数据导出功能
    static exportData() {
        const data = {};
        Object.values(this.KEYS).forEach(key => {
            data[key] = this.load(key);
        });

        const blob = new Blob([JSON.stringify(data, null, 2)], {
            type: 'application/json'
        });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `our_memory_backup_${new Date().toISOString().split('T')[0]}.json`;
        a.click();
        URL.revokeObjectURL(url);
    }

    // 数据导入功能
    static async importData(file) {
        try {
            const text = await file.text();
            const data = JSON.parse(text);
            
            // 验证数据格式
            if (!this.validateImportData(data)) {
                throw new Error('数据格式不正确');
            }

            // 导入所有数据
            Object.entries(data).forEach(([key, value]) => {
                this.save(key, value);
            });

            UIManager.showToast('数据导入成功', 'success');
            return true;
        } catch (error) {
            console.error('数据导入失败:', error);
            UIManager.showToast('数据导入失败', 'error');
            return false;
        }
    }

    static validateImportData(data) {
        // 验证数据结构
        const requiredKeys = Object.values(this.KEYS);
        return requiredKeys.every(key => key in data);
    }

    // 数据备份到云端（如果需要的话）
    static async backupToCloud() {
        // 实现云端备份逻辑
    }

    // 从云端恢复数据（如果需要的话）
    static async restoreFromCloud() {
        // 实现云端恢复逻辑
    }
} 