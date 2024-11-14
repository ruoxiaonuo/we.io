// 配置对象
const CONFIG = {
    START_DATE: '2024-01-29',
    UPDATE_INTERVAL: 1000, // 更新间隔（毫秒）
    DATE_FORMAT: {
        year: 'numeric',
        month: '2-digit',
        day: '2-digit'
    }
};

class TimeManager {
    constructor(startDate) {
        this.startTimestamp = new Date(startDate).getTime();
        this.updateIntervalId = null;
        this.init();
    }

    init() {
        try {
            this.startUpdating();
            this.updateTime(); // 立即执行一次更新
        } catch (error) {
            console.error('初始化时间管理器失败:', error);
            this.handleError(error);
        }
    }

    startUpdating() {
        if (this.updateIntervalId) {
            clearInterval(this.updateIntervalId);
        }
        this.updateIntervalId = setInterval(() => this.updateTime(), CONFIG.UPDATE_INTERVAL);
    }

    stopUpdating() {
        if (this.updateIntervalId) {
            clearInterval(this.updateIntervalId);
            this.updateIntervalId = null;
        }
    }

    calculateTimeDifference(timestamp) {
        const difference = timestamp - this.startTimestamp;
        return {
            days: Math.floor(difference / (1000 * 60 * 60 * 24)),
            hours: Math.floor((difference % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60)),
            minutes: Math.floor((difference % (1000 * 60 * 60)) / (1000 * 60)),
            seconds: Math.floor((difference % (1000 * 60)) / 1000)
        };
    }

    updateTime() {
        try {
            const now = new Date();
            const currentTime = now.getTime();

            // 更新已经在一起的时间
            const elapsed = this.calculateTimeDifference(currentTime);
            this.updateElapsedTime(elapsed);

            // 计算下一个纪念日
            const nextAnniversary = this.calculateNextAnniversary(now);
            const remaining = this.calculateTimeDifference(nextAnniversary.getTime());
            this.updateRemainingTime(remaining);

        } catch (error) {
            console.error('更新时间失败:', error);
            this.handleError(error);
        }
    }

    updateElapsedTime(time) {
        const elements = {
            days: document.getElementById('days'),
            hours: document.getElementById('hours'),
            minutes: document.getElementById('minutes'),
            seconds: document.getElementById('seconds')
        };

        // 使用批量更新减少重排重绘
        requestAnimationFrame(() => {
            for (const [key, element] of Object.entries(elements)) {
                if (element) {
                    element.textContent = time[key];
                }
            }
        });
    }

    updateRemainingTime(time) {
        const elements = {
            nextDays: document.getElementById('nextDays'),
            nextHours: document.getElementById('nextHours'),
            nextMinutes: document.getElementById('nextMinutes')
        };

        requestAnimationFrame(() => {
            for (const [key, element] of Object.entries(elements)) {
                if (element) {
                    element.textContent = time[key];
                }
            }
        });
    }

    calculateNextAnniversary(currentDate) {
        const currentYear = currentDate.getFullYear();
        let nextAnniversary = new Date(currentYear, 0, 29); // 1月29日

        if (currentDate > nextAnniversary) {
            nextAnniversary.setFullYear(currentYear + 1);
        }

        return nextAnniversary;
    }

    handleError(error) {
        // 添加错误处理UI
        const errorMessage = document.createElement('div');
        errorMessage.className = 'error-message';
        errorMessage.textContent = '时间更新出现错误，请刷新页面重试';
        document.body.appendChild(errorMessage);

        // 停止更新
        this.stopUpdating();

        // 3秒后移除错误消息
        setTimeout(() => {
            errorMessage.remove();
        }, 3000);
    }
}

// 页面加载完成后初始化
document.addEventListener('DOMContentLoaded', () => {
    new TimeManager(CONFIG.START_DATE);
});

// 页面不可见时停止更新，可见时恢复更新
document.addEventListener('visibilitychange', () => {
    const timeManager = window.timeManager;
    if (timeManager) {
        if (document.hidden) {
            timeManager.stopUpdating();
        } else {
            timeManager.startUpdating();
        }
    }
}); 