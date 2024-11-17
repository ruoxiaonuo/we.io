class DataManager {
    constructor() {
        this.githubToken = Utils.storage.get('githubToken');
        this.githubRepo = Utils.storage.get('githubRepo');
        this.lastSyncTime = Utils.storage.get('lastSyncTime');
        this.syncInterval = 60000; // 每分钟同步一次
        this.init();
    }

    init() {
        // 启动自动同步
        this.startAutoSync();
        // 添加页面关闭前同步
        window.addEventListener('beforeunload', () => this.syncToGithub());
    }

    startAutoSync() {
        // 定期同步
        setInterval(() => this.checkForUpdates(), this.syncInterval);
        // 立即执行一次同步
        this.checkForUpdates();
    }

    async checkForUpdates() {
        try {
            // 获取远程数据
            const remoteData = await this.fetchRemoteData();
            if (!remoteData) return;

            // 比较本地和远程数据的时间戳
            if (remoteData.timestamp > this.lastSyncTime) {
                // 远程数据较新，更新本地数据
                await this.updateLocalData(remoteData);
                UIManager.showToast('数据已同步', 'info');
            }
        } catch (error) {
            console.error('同步检查失败:', error);
        }
    }

    async fetchRemoteData() {
        try {
            const response = await fetch(
                `https://api.github.com/repos/${this.githubRepo}/contents/data/latest.json`,
                {
                    headers: {
                        'Authorization': `token ${this.githubToken}`,
                        'Accept': 'application/vnd.github.v3+json'
                    }
                }
            );

            if (!response.ok) return null;

            const data = await response.json();
            return JSON.parse(atob(data.content));
        } catch (error) {
            console.error('获取远程数据失败:', error);
            return null;
        }
    }

    async updateLocalData(remoteData) {
        // 更新本地存储
        Utils.storage.set(CONFIG.STORAGE_KEYS.MEMORIES, remoteData.memories);
        Utils.storage.set(CONFIG.STORAGE_KEYS.PHOTOS, remoteData.photos);
        Utils.storage.set(CONFIG.STORAGE_KEYS.FIGHTS, remoteData.fights);
        Utils.storage.set('lastSyncTime', remoteData.timestamp);
        this.lastSyncTime = remoteData.timestamp;

        // 触发更新事件
        window.eventBus.emit('dataUpdated', remoteData);
    }

    async syncToGithub() {
        try {
            // 准备同步数据
            const syncData = {
                memories: Utils.storage.get(CONFIG.STORAGE_KEYS.MEMORIES, []),
                photos: Utils.storage.get(CONFIG.STORAGE_KEYS.PHOTOS, []),
                fights: Utils.storage.get(CONFIG.STORAGE_KEYS.FIGHTS, []),
                timestamp: Date.now()
            };

            // 同步到GitHub
            const content = btoa(JSON.stringify(syncData, null, 2));
            const path = 'data/latest.json';

            const response = await fetch(
                `https://api.github.com/repos/${this.githubRepo}/contents/${path}`,
                {
                    method: 'PUT',
                    headers: {
                        'Authorization': `token ${this.githubToken}`,
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify({
                        message: `Update data: ${new Date().toISOString()}`,
                        content: content,
                        sha: await this.getFileSha(path)
                    })
                }
            );

            if (!response.ok) {
                throw new Error('同步失败');
            }

            // 更新最后同步时间
            this.lastSyncTime = syncData.timestamp;
            Utils.storage.set('lastSyncTime', this.lastSyncTime);

            return true;
        } catch (error) {
            console.error('同步失败:', error);
            return false;
        }
    }

    async getFileSha(path) {
        try {
            const response = await fetch(
                `https://api.github.com/repos/${this.githubRepo}/contents/${path}`,
                {
                    headers: {
                        'Authorization': `token ${this.githubToken}`,
                        'Accept': 'application/vnd.github.v3+json'
                    }
                }
            );

            if (response.ok) {
                const data = await response.json();
                return data.sha;
            }
            return null;
        } catch (error) {
            return null;
        }
    }

    // 添加新数据时调用此方法
    async addData(type, data) {
        // 保存到本地
        const items = Utils.storage.get(CONFIG.STORAGE_KEYS[type], []);
        items.unshift(data);
        Utils.storage.set(CONFIG.STORAGE_KEYS[type], items);

        // 同步到GitHub
        await this.syncToGithub();

        // 触发更新事件
        window.eventBus.emit('dataAdded', { type, data });
    }

    // GitHub 配置设置
    setGithubConfig(token, repo) {
        this.githubToken = token;
        this.githubRepo = repo;
        Utils.storage.set('githubToken', token);
        Utils.storage.set('githubRepo', repo);
    }
} 