const CONFIG = {
    // 基础配置
    APP: {
        NAME: 'Our Memory',
        VERSION: '1.0.0',
        START_DATE: '2024-01-29',
        DEBUG: false
    },

    // API配置
    API: {
        BASE_URL: '',
        TIMEOUT: 10000
    },

    // 存储键
    STORAGE_KEYS: {
        SETTINGS: 'settings',
        USER_DATA: 'userData',
        MEMORIES: 'memories',
        PHOTOS: 'photos',
        FIGHTS: 'fights',
        CALENDAR: 'calendar'
    },

    // 主题配置
    THEME: {
        COLORS: {
            PRIMARY: '#ff6b6b',
            SECONDARY: '#ffa5a5',
            BACKGROUND: '#fff0f0',
            TEXT: '#333333',
            TEXT_LIGHT: '#666666'
        },
        DARK: {
            PRIMARY: '#ff4f4f',
            SECONDARY: '#ff8080',
            BACKGROUND: '#1a1a1a',
            TEXT: '#ffffff',
            TEXT_LIGHT: '#cccccc'
        }
    },

    // 动画配置
    ANIMATION: {
        DURATION: {
            SHORT: 200,
            MEDIUM: 300,
            LONG: 500
        },
        EASING: {
            DEFAULT: 'cubic-bezier(0.4, 0, 0.2, 1)',
            EASE_IN: 'cubic-bezier(0.4, 0, 1, 1)',
            EASE_OUT: 'cubic-bezier(0, 0, 0.2, 1)'
        }
    },

    // 验证规则
    VALIDATION: {
        MAX_FILE_SIZE: 5 * 1024 * 1024, // 5MB
        ALLOWED_IMAGE_TYPES: ['image/jpeg', 'image/png', 'image/webp'],
        MAX_TITLE_LENGTH: 100,
        MAX_DESCRIPTION_LENGTH: 1000
    },

    // 通知配置
    NOTIFICATION: {
        DURATION: 3000,
        POSITION: 'top-right'
    },

    // 路由配置
    ROUTES: {
        HOME: '/',
        CALENDAR: '/calendar',
        MEMORY: '/memory',
        PHOTOS: '/photos',
        FIGHTS: '/fights'
    },

    // 本地化配置
    LOCALE: {
        DEFAULT: 'zh-CN',
        FALLBACK: 'en-US',
        SUPPORTED: ['zh-CN', 'en-US']
    }
};

// 防止配置被修改
Object.freeze(CONFIG); 