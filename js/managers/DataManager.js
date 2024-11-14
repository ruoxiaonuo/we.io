class DataManager {
    constructor() {
        this.githubToken = Utils.storage.get('githubToken');
        this.githubRepo = Utils.storage.get('githubRepo');
    }

    async syncToGithub(data) {
        try {
            if (!this.githubToken || !this.githubRepo) {
                throw new Error('请先配置 GitHub 信息');
            }

            const content = btoa(JSON.stringify(data, null, 2)); // Base64 编码
            const timestamp = new Date().toISOString();
            const path = `data/memories/${timestamp}.json`;

            const response = await fetch(`https://api.github.com/repos/${this.githubRepo}/contents/${path}`, {
                method: 'PUT',
                headers: {
                    'Authorization': `token ${this.githubToken}`,
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    message: `Add memory: ${timestamp}`,
                    content: content
                })
            });

            if (!response.ok) {
                throw new Error('同步到 GitHub 失败');
            }

            UIManager.showToast('同步成功', 'success');
            return true;

        } catch (error) {
            Utils.handleError(error);
            return false;
        }
    }

    async saveMemory(memoryData) {
        try {
            // 保存到本地
            const memories = Utils.storage.get(CONFIG.STORAGE_KEYS.MEMORIES, []);
            memories.unshift(memoryData);
            Utils.storage.set(CONFIG.STORAGE_KEYS.MEMORIES, memories);

            // 同步到 GitHub
            await this.syncToGithub(memoryData);

            return true;
        } catch (error) {
            Utils.handleError(error);
            return false;
        }
    }

    // GitHub 配置设置
    setGithubConfig(token, repo) {
        this.githubToken = token;
        this.githubRepo = repo;
        Utils.storage.set('githubToken', token);
        Utils.storage.set('githubRepo', repo);
    }
} 