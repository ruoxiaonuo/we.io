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
        this.updateIntervalId = setInterval(() => this.updateTime(), 1000);
    }

    stopUpdating() {
        if (this.updateIntervalId) {
            clearInterval(this.updateIntervalId);
            this.updateIntervalId = null;
        }
    }

    calculateTimeDifference(timestamp) {
        const difference = Math.max(0, timestamp - this.startTimestamp);
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
            const remaining = this.calculateRemainingTime(nextAnniversary);
            this.updateRemainingTime(remaining);

        } catch (error) {
            console.error('更新时间失败:', error);
            this.handleError(error);
        }
    }

    calculateNextAnniversary(now) {
        const currentYear = now.getFullYear();
        const anniversaryThisYear = new Date(currentYear, 0, 29); // 1月29日

        // 如果今年的纪念日已经过了，计算明年的
        if (now > anniversaryThisYear) {
            return new Date(currentYear + 1, 0, 29);
        }
        return anniversaryThisYear;
    }

    calculateRemainingTime(targetDate) {
        const now = new Date();
        const difference = Math.max(0, targetDate.getTime() - now.getTime());

        return {
            days: Math.floor(difference / (1000 * 60 * 60 * 24)),
            hours: Math.floor((difference % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60)),
            minutes: Math.floor((difference % (1000 * 60 * 60)) / (1000 * 60))
        };
    }

    updateElapsedTime(time) {
        const elements = {
            days: document.getElementById('days'),
            hours: document.getElementById('hours'),
            minutes: document.getElementById('minutes'),
            seconds: document.getElementById('seconds')
        };

        for (const [key, element] of Object.entries(elements)) {
            if (element) {
                element.textContent = String(time[key]).padStart(2, '0');
            }
        }
    }

    updateRemainingTime(time) {
        const elements = {
            nextDays: document.getElementById('nextDays'),
            nextHours: document.getElementById('nextHours'),
            nextMinutes: document.getElementById('nextMinutes')
        };

        for (const [key, element] of Object.entries(elements)) {
            if (element) {
                const value = time[key.replace('next', '').toLowerCase()];
                element.textContent = String(value).padStart(2, '0');
            }
        }
    }

    handleError(error) {
        const errorMessage = document.createElement('div');
        errorMessage.className = 'error-message';
        errorMessage.textContent = '时间更新出现错误，请刷新页面重试';
        document.body.appendChild(errorMessage);

        this.stopUpdating();

        setTimeout(() => {
            errorMessage.remove();
        }, 3000);
    }
}

// 初始化
document.addEventListener('DOMContentLoaded', () => {
    window.timeManager = new TimeManager('2024-01-29');
});

// 页面可见性控制
document.addEventListener('visibilitychange', () => {
    if (window.timeManager) {
        if (document.hidden) {
            window.timeManager.stopUpdating();
        } else {
            window.timeManager.startUpdating();
        }
    }
}); 