class GithubConfig {
    static showConfigModal() {
        const modal = UIManager.createModal({
            title: 'GitHub 配置',
            content: `
                <div class="github-config-form">
                    <div class="form-group">
                        <label>Personal Access Token</label>
                        <input type="password" id="githubToken" class="form-input" 
                               placeholder="输入你的 GitHub Token">
                        <small>在 GitHub Settings -> Developer settings -> Personal access tokens 生成</small>
                    </div>
                    <div class="form-group">
                        <label>仓库地址</label>
                        <input type="text" id="githubRepo" class="form-input" 
                               placeholder="username/repository">
                        <small>格式：用户名/仓库名</small>
                    </div>
                </div>
            `,
            footer: `
                <button class="btn btn-primary save-github-config">保存配置</button>
                <button class="btn btn-secondary" data-dismiss="modal">取消</button>
            `
        });

        // 绑定保存事件
        modal.querySelector('.save-github-config').onclick = () => {
            const token = document.getElementById('githubToken').value;
            const repo = document.getElementById('githubRepo').value;

            if (!token || !repo) {
                UIManager.showToast('请填写完整信息', 'error');
                return;
            }

            window.dataManager.setGithubConfig(token, repo);
            UIManager.showToast('配置已保存', 'success');
            modal.close();
        };
    }
} 