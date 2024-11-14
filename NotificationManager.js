class NotificationManager {
    static TYPES = {
        ANNIVERSARY: 'anniversary',
        MEMORY: 'memory',
        CALENDAR: 'calendar',
        FIGHT: 'fight'
    };

    constructor() {
        this.notifications = [];
        this.hasPermission = false;
        this.init();
    }

    async init() {
        try {
            // 检查通知权限
            if ('Notification' in window) {
                const permission = await Notification.requestPermission();
                this.hasPermission = permission === 'granted';
            }

            // 加载保存的通知设置
            this.loadSettings();
            
            // 开始检查通知
            this.startChecking();
        } catch (error) {
            console.error('通知初始化失败:', error);
        }
    }

    loadSettings() {
        const settings = localStorage.getItem('notificationSettings');
        if (settings) {
            this.settings = JSON.parse(settings);
        } else {
            this.settings = {
                enabled: true,
                types: {
                    [this.TYPES.ANNIVERSARY]: true,
                    [this.TYPES.MEMORY]: true,
                    [this.TYPES.CALENDAR]: true,
                    [this.TYPES.FIGHT]: true
                },
                advanceTime: {
                    days: 1,
                    hours: 0
                }
            };
            this.saveSettings();
        }
    }

    saveSettings() {
        localStorage.setItem('notificationSettings', JSON.stringify(this.settings));
    }

    startChecking() {
        // 每小时检查一次
        setInterval(() => this.checkNotifications(), 3600000);
        // 立即检查一次
        this.checkNotifications();
    }

    async checkNotifications() {
        if (!this.settings.enabled || !this.hasPermission) return;

        const now = new Date();
        const upcoming = this.getUpcomingEvents(now);

        upcoming.forEach(event => {
            if (!this.notifications.includes(event.id)) {
                this.showNotification(event);
                this.notifications.push(event.id);
            }
        });

        // 清理过期通知
        this.cleanupNotifications(now);
    }

    getUpcomingEvents(now) {
        const events = [];
        const checkTime = new Date(now.getTime() + this.getAdvanceTime());

        // 检查纪念日
        const anniversary = this.getNextAnniversary(now);
        if (anniversary.time <= checkTime) {
            events.push({
                id: `anniversary_${anniversary.time}`,
                type: this.TYPES.ANNIVERSARY,
                title: '纪念日提醒',
                message: `距离下一个纪念日还有${this.formatTimeDistance(now, anniversary.time)}`,
                time: anniversary.time
            });
        }

        // 检查日历事件
        const calendarEvents = this.getCalendarEvents(now, checkTime);
        events.push(...calendarEvents);

        return events;
    }

    getNextAnniversary(now) {
        const startDate = new Date('2024-01-29');
        const currentYear = now.getFullYear();
        let anniversaryDate = new Date(currentYear, startDate.getMonth(), startDate.getDate());
        
        if (anniversaryDate < now) {
            anniversaryDate.setFullYear(currentYear + 1);
        }

        return {
            time: anniversaryDate,
            type: 'monthly'
        };
    }

    getCalendarEvents(now, checkTime) {
        const events = [];
        const calendarData = JSON.parse(localStorage.getItem('calendarEvents') || '{}');

        Object.entries(calendarData).forEach(([date, eventList]) => {
            const eventTime = new Date(date);
            if (eventTime > now && eventTime <= checkTime) {
                eventList.forEach(event => {
                    events.push({
                        id: `calendar_${date}_${event.timestamp}`,
                        type: this.TYPES.CALENDAR,
                        title: event.title,
                        message: `即将到来的事件：${event.title}`,
                        time: eventTime
                    });
                });
            }
        });

        return events;
    }

    getAdvanceTime() {
        return (this.settings.advanceTime.days * 24 + this.settings.advanceTime.hours) * 3600000;
    }

    formatTimeDistance(from, to) {
        const diff = to - from;
        const days = Math.floor(diff / (24 * 3600000));
        const hours = Math.floor((diff % (24 * 3600000)) / 3600000);
        
        let result = '';
        if (days > 0) result += `${days}天`;
        if (hours > 0) result += `${hours}小时`;
        return result;
    }

    showNotification(event) {
        if (!this.hasPermission) return;

        const notification = new Notification(event.title, {
            body: event.message,
            icon: '/images/icon.png',
            badge: '/images/badge.png',
            tag: event.id,
            renotify: true
        });

        notification.onclick = () => {
            window.focus();
            this.handleNotificationClick(event);
        };
    }

    handleNotificationClick(event) {
        switch (event.type) {
            case this.TYPES.ANNIVERSARY:
                window.location.href = '/';
                break;
            case this.TYPES.CALENDAR:
                window.location.href = '/calendar.html';
                break;
            // ... 其他类型的处理
        }
    }

    cleanupNotifications(now) {
        this.notifications = this.notifications.filter(id => {
            const [type, timeStr] = id.split('_');
            const time = new Date(timeStr);
            return time > now;
        });
    }

    // 设置相关方法
    enableNotifications(enabled) {
        this.settings.enabled = enabled;
        this.saveSettings();
    }

    setTypeEnabled(type, enabled) {
        if (type in this.settings.types) {
            this.settings.types[type] = enabled;
            this.saveSettings();
        }
    }

    setAdvanceTime(days, hours) {
        this.settings.advanceTime = { days, hours };
        this.saveSettings();
    }
}

// 初始化通知管理器
document.addEventListener('DOMContentLoaded', () => {
    window.notificationManager = new NotificationManager();
}); 