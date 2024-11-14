class GithubManager {
    constructor() {
        this.token = Utils.storage.get('githubToken');
        this.repo = Utils.storage.get('githubRepo');
        this.baseUrl = 'https://api.github.com';
        this.init();
    }

    init() {
        this.bindEvents();
        this.checkConfig();
    }

    bindEvents() {
        const configBtn = document.getElementById('githubConfigBtn');
        if (configBtn) {
            configBtn.addEventListener('click', () => this.showConfigModal());
        }
    }

    checkConfig() {
        if (!this.token || !this.repo) {
            console.warn('GitHub 配置未完成');
            return false;
        }
        return true;
    }

    async syncData(data, type = 'memory') {
        try {
            if (!this.checkConfig()) {
                throw new Error('请先完成 GitHub 配置');
            }

            LoadingManager.show('正在同步...');

            const timestamp = new Date().toISOString();
            const path = `data/${type}s/${timestamp}.json`;
            const content = btoa(JSON.stringify(data, null, 2));

            const response = await fetch(`${this.baseUrl}/repos/${this.repo}/contents/${path}`, {
                method: 'PUT',
                headers: {
                    'Authorization': `token ${this.token}`,
                    'Accept': 'application/vnd.github.v3+json',
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    message: `Add ${type}: ${timestamp}`,
                    content: content
                })
            });

            if (!response.ok) {
                const error = await response.json();
                throw new Error(error.message);
            }

            UIManager.showToast('同步成功', 'success');
            return true;

        } catch (error) {
            UIManager.showToast(error.message, 'error');
            return false;
        } finally {
            LoadingManager.hide();
        }
    }

    showConfigModal() {
        const modal = UIManager.createModal({
            title: 'GitHub 同步设置',
            content: `
                <div class="github-config-form">
                    <div class="form-group">
                        <label>Personal Access Token</label>
                        <input type="password" id="githubToken" 
                               class="form-input" 
                               value="${this.token || ''}"
                               placeholder="输入你的 GitHub Token">
                        <div class="form-help">
                            <i class="fas fa-info-circle"></i>
                            在 GitHub Settings -> Developer settings -> 
                            Personal access tokens 生成
                        </div>
                    </div>
                    <div class="form-group">
                        <label>仓库地址</label>
                        <input type="text" id="githubRepo" 
                               class="form-input" 
                               value="${this.repo || ''}"
                               placeholder="username/repository">
                        <div class="form-help">
                            <i class="fas fa-info-circle"></i>
                            格式：用户名/仓库名，例如：john/our-memory-data
                        </div>
                    </div>
                </div>
            `,
            footer: `
                <button class="btn btn-primary save-config">保存配置</button>
                <button class="btn btn-secondary" data-dismiss="modal">取消</button>
                <button class="btn btn-link test-config">测试连接</button>
            `
        });

        // 绑定保存事件
        modal.querySelector('.save-config').onclick = () => this.saveConfig(modal);
        modal.querySelector('.test-config').onclick = () => this.testConnection();
    }

    async saveConfig(modal) {
        const token = document.getElementById('githubToken').value.trim();
        const repo = document.getElementById('githubRepo').value.trim();

        if (!token || !repo) {
            UIManager.showToast('请填写完整信息', 'error');
            return;
        }

        this.token = token;
        this.repo = repo;
        Utils.storage.set('githubToken', token);
        Utils.storage.set('githubRepo', repo);

        UIManager.showToast('配置已保存', 'success');
        modal.close();
    }

    async testConnection() {
        try {
            LoadingManager.show('测试连接中...');
            const token = document.getElementById('githubToken').value.trim();
            const repo = document.getElementById('githubRepo').value.trim();

            if (!token || !repo) {
                throw new Error('请先填写配置信息');
            }

            const response = await fetch(`${this.baseUrl}/repos/${repo}`, {
                headers: {
                    'Authorization': `token ${token}`,
                    'Accept': 'application/vnd.github.v3+json'
                }
            });

            if (!response.ok) {
                throw new Error('连接测试失败，请检查配置');
            }

            UIManager.showToast('连接测试成功', 'success');

        } catch (error) {
            UIManager.showToast(error.message, 'error');
        } finally {
            LoadingManager.hide();
        }
    }
} 