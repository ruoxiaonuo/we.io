const CONFIG = {
    // 基础配置
    START_DATE: '2024-01-29',
    APP_NAME: 'Our Memory',
    
    // 本地存储键名
    STORAGE_KEYS: {
        MEMORIES: 'memories',
        PHOTOS: 'photos',
        FIGHTS: 'fights',
        CALENDAR_EVENTS: 'calendarEvents'
    },
    
    // 图片处理配置
    IMAGE: {
        MAX_SIZE: 1024 * 1024, // 1MB
        QUALITY: 0.9,
        ALLOWED_TYPES: ['image/jpeg', 'image/png', 'image/webp']
    },
    
    // 动画配置
    ANIMATION: {
        DURATION: 300,
        TIMING: 'ease'
    },
    
    // 错误消息
    MESSAGES: {
        ERROR: {
            IMAGE_SIZE: '图片大小不能超过1MB',
            REQUIRED_FIELD: '请填写必填项',
            SAVE_FAILED: '保存失败，请重试',
            LOAD_FAILED: '加载失败，请刷新页面'
        },
        SUCCESS: {
            SAVE: '保存成功',
            DELETE: '删除成功'
        }
    }
};

// 防止配置被修改
Object.freeze(CONFIG); 