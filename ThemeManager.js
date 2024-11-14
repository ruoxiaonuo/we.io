class ThemeManager {
    static THEMES = {
        DEFAULT: {
            primary: '#ff6b6b',
            secondary: '#ffa5a5',
            background: '#fff0f0',
            text: '#333333',
            textLight: '#666666',
            white: '#ffffff',
            shadow: 'rgba(0, 0, 0, 0.1)'
        },
        DARK: {
            primary: '#ff4f4f',
            secondary: '#ff8080',
            background: '#1a1a1a',
            text: '#ffffff',
            textLight: '#cccccc',
            white: '#2a2a2a',
            shadow: 'rgba(0, 0, 0, 0.3)'
        }
    };

    static currentTheme = 'DEFAULT';

    static init() {
        // 检查本地存储的主题设置
        const savedTheme = localStorage.getItem('theme') || 'DEFAULT';
        this.setTheme(savedTheme);

        // 监听系统主题变化
        window.matchMedia('(prefers-color-scheme: dark)').addListener((e) => {
            this.setTheme(e.matches ? 'DARK' : 'DEFAULT');
        });
    }

    static setTheme(themeName) {
        if (!this.THEMES[themeName]) return;

        this.currentTheme = themeName;
        localStorage.setItem('theme', themeName);

        const theme = this.THEMES[themeName];
        const root = document.documentElement;

        // 设置CSS变量
        Object.entries(theme).forEach(([key, value]) => {
            root.style.setProperty(`--${key}`, value);
        });

        // 触发主题变化事件
        window.eventBus.emit('themeChanged', themeName);

        // 更新body类名
        document.body.className = `theme-${themeName.toLowerCase()}`;
    }

    static toggleTheme() {
        const newTheme = this.currentTheme === 'DEFAULT' ? 'DARK' : 'DEFAULT';
        this.setTheme(newTheme);
    }

    // 获取当前主题的颜色
    static getColor(colorName) {
        return this.THEMES[this.currentTheme][colorName];
    }

    // 生成渐变色
    static getGradient(direction = '45deg') {
        const theme = this.THEMES[this.currentTheme];
        return `linear-gradient(${direction}, ${theme.primary}, ${theme.secondary})`;
    }

    // 生成阴影效果
    static getShadow(level = 1) {
        const opacity = 0.1 * level;
        return `0 ${2 * level}px ${4 * level}px rgba(0, 0, 0, ${opacity})`;
    }

    // 添加动画效果
    static addAnimation(element, animationName, duration = 300) {
        element.style.animation = `${animationName} ${duration}ms var(--timing-function)`;
        return new Promise(resolve => {
            element.addEventListener('animationend', () => {
                element.style.animation = '';
                resolve();
            }, { once: true });
        });
    }

    // 生成主题切换按钮
    static createThemeToggle() {
        const button = document.createElement('button');
        button.className = 'theme-toggle';
        button.innerHTML = this.currentTheme === 'DEFAULT' ? '🌙' : '☀️';
        button.onclick = () => this.toggleTheme();
        return button;
    }
}

// 添加对应的CSS
const style = document.createElement('style');
style.textContent = `
    :root {
        --timing-function: cubic-bezier(0.4, 0, 0.2, 1);
        --transition-duration: 300ms;
    }

    body {
        transition: background-color var(--transition-duration) var(--timing-function),
                    color var(--transition-duration) var(--timing-function);
    }

    .theme-toggle {
        position: fixed;
        bottom: 20px;
        left: 20px;
        width: 40px;
        height: 40px;
        border-radius: 50%;
        border: none;
        background: var(--primary);
        color: var(--white);
        cursor: pointer;
        box-shadow: var(--shadow);
        transition: transform var(--transition-duration) var(--timing-function);
        z-index: 1000;
    }

    .theme-toggle:hover {
        transform: scale(1.1);
    }

    .theme-dark {
        background-color: var(--background);
        color: var(--text);
    }

    @keyframes fadeIn {
        from { opacity: 0; }
        to { opacity: 1; }
    }

    @keyframes slideUp {
        from { transform: translateY(20px); opacity: 0; }
        to { transform: translateY(0); opacity: 1; }
    }
`;

document.head.appendChild(style);

// 初始化主题管理器
document.addEventListener('DOMContentLoaded', () => {
    ThemeManager.init();
}); 