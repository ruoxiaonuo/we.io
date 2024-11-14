class RouterManager {
    static ROUTES = {
        home: {
            path: '/',
            title: '我们的纪念日',
            template: 'index.html'
        },
        calendar: {
            path: '/calendar',
            title: '日历 - 我们的纪念日',
            template: 'calendar.html'
        },
        memory: {
            path: '/memory',
            title: '美好回忆 - 我们的纪念日',
            template: 'memory.html'
        },
        photos: {
            path: '/photos',
            title: '照片墙 - 我们的纪念日',
            template: 'photos.html'
        },
        fights: {
            path: '/fights',
            title: '吵架记录 - 我们的纪念日',
            template: 'fights.html'
        }
    };

    constructor() {
        this.currentRoute = null;
        this.init();
    }

    init() {
        // 监听浏览器前进后退
        window.addEventListener('popstate', (e) => {
            this.handleRoute(window.location.pathname, false);
        });

        // 拦截所有导航链接点击
        document.addEventListener('click', (e) => {
            if (e.target.matches('a') && e.target.href.startsWith(window.location.origin)) {
                e.preventDefault();
                const path = new URL(e.target.href).pathname;
                this.navigate(path);
            }
        });

        // 处理初始路由
        this.handleRoute(window.location.pathname, false);
    }

    async handleRoute(path, addToHistory = true) {
        // 查找匹配的路由
        const route = Object.values(RouterManager.ROUTES).find(r => r.path === path);
        if (!route) {
            this.handle404();
            return;
        }

        try {
            // 显示加载状态
            LoadingManager.show();

            // 更新标题
            document.title = route.title;

            // 更新导航状态
            this.updateNavigation(path);

            // 如果需要，添加到历史记录
            if (addToHistory) {
                window.history.pushState({}, route.title, path);
            }

            // 加载页面内容
            const content = await this.loadTemplate(route.template);
            document.getElementById('app').innerHTML = content;

            // 初始化页面特定的功能
            this.initPageModules(path);

        } catch (error) {
            console.error('路由处理失败:', error);
            ErrorHandler.showError('页面加载失败，请重试');
        } finally {
            LoadingManager.hide();
        }
    }

    async loadTemplate(templatePath) {
        const response = await fetch(templatePath);
        if (!response.ok) throw new Error('模板加载失败');
        const html = await response.text();
        
        // 提取 body 内容
        const temp = document.createElement('div');
        temp.innerHTML = html;
        return temp.querySelector('body').innerHTML;
    }

    updateNavigation(path) {
        // 更新导航栏激活状态
        document.querySelectorAll('.nav-links a').forEach(link => {
            link.classList.toggle('active', link.pathname === path);
        });
    }

    initPageModules(path) {
        // 根据路由初始化对应的功能模块
        switch (path) {
            case '/calendar':
                new Calendar();
                break;
            case '/memory':
                new MemoryManager();
                break;
            case '/photos':
                new PhotoManager();
                break;
            case '/fights':
                new FightManager();
                break;
            case '/':
                new TimeManager(CONFIG.START_DATE);
                break;
        }
    }

    navigate(path) {
        this.handleRoute(path);
    }

    handle404() {
        document.title = '页面未找到';
        document.getElementById('app').innerHTML = `
            <div class="error-page">
                <h1>404</h1>
                <p>抱歉，页面未找到</p>
                <a href="/" class="back-home">返回首页</a>
            </div>
        `;
    }

    static addRouteGuard(callback) {
        window.addEventListener('beforeunload', callback);
    }
}

// 初始化路由管理器
document.addEventListener('DOMContentLoaded', () => {
    window.router = new RouterManager();
}); 