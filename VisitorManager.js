class VisitorManager {
    static STORAGE_KEY = 'visitorRecords';

    constructor() {
        this.records = this.loadRecords();
        this.init();
    }

    init() {
        this.addVisitRecord();
        this.renderVisitorStats();
        this.bindEvents();
    }

    loadRecords() {
        return JSON.parse(localStorage.getItem(VisitorManager.STORAGE_KEY) || '[]');
    }

    saveRecords() {
        localStorage.setItem(VisitorManager.STORAGE_KEY, JSON.stringify(this.records));
    }

    addVisitRecord() {
        const now = new Date();
        const record = {
            timestamp: now.getTime(),
            date: now.toLocaleDateString(),
            time: now.toLocaleTimeString(),
            page: window.location.pathname,
            userAgent: navigator.userAgent,
            screenSize: `${window.innerWidth}x${window.innerHeight}`,
            referrer: document.referrer || 'Direct'
        };

        this.records.push(record);
        this.saveRecords();
        this.updateVisitCount();
    }

    updateVisitCount() {
        const visitCount = document.getElementById('visitCount');
        if (visitCount) {
            visitCount.textContent = this.records.length;
        }
    }

    renderVisitorStats() {
        const stats = document.createElement('div');
        stats.className = 'visitor-stats';
        stats.innerHTML = `
            <div class="stats-toggle">📊</div>
            <div class="stats-panel">
                <h3>访问统计</h3>
                <div class="stats-content">
                    <div class="stats-item">
                        <span class="stats-label">总访问量</span>
                        <span class="stats-value" id="visitCount">${this.records.length}</span>
                    </div>
                    <div class="stats-item">
                        <span class="stats-label">今日访问</span>
                        <span class="stats-value" id="todayCount">${this.getTodayVisits()}</span>
                    </div>
                    <div class="stats-item">
                        <span class="stats-label">本周访问</span>
                        <span class="stats-value" id="weekCount">${this.getWeekVisits()}</span>
                    </div>
                    <div class="stats-chart" id="visitsChart"></div>
                </div>
                <button class="view-details-btn">查看详细记录</button>
            </div>
        `;

        document.body.appendChild(stats);
        this.renderVisitsChart();
    }

    getTodayVisits() {
        const today = new Date().toLocaleDateString();
        return this.records.filter(record => record.date === today).length;
    }

    getWeekVisits() {
        const weekAgo = new Date();
        weekAgo.setDate(weekAgo.getDate() - 7);
        return this.records.filter(record => new Date(record.timestamp) > weekAgo).length;
    }

    renderVisitsChart() {
        const chartData = this.getChartData();
        const canvas = document.createElement('canvas');
        canvas.id = 'visitsChartCanvas';
        document.getElementById('visitsChart').appendChild(canvas);

        const ctx = canvas.getContext('2d');
        const gradient = ctx.createLinearGradient(0, 0, 0, 150);
        gradient.addColorStop(0, 'rgba(255, 107, 107, 0.5)');
        gradient.addColorStop(1, 'rgba(255, 107, 107, 0.1)');

        new Chart(ctx, {
            type: 'line',
            data: {
                labels: chartData.labels,
                datasets: [{
                    label: '访问量',
                    data: chartData.data,
                    fill: true,
                    backgroundColor: gradient,
                    borderColor: '#ff6b6b',
                    tension: 0.4
                }]
            },
            options: {
                responsive: true,
                maintainAspectRatio: false,
                plugins: {
                    legend: {
                        display: false
                    }
                },
                scales: {
                    y: {
                        beginAtZero: true,
                        ticks: {
                            stepSize: 1
                        }
                    }
                }
            }
        });
    }

    getChartData() {
        const days = 7;
        const data = new Array(days).fill(0);
        const labels = [];
        const now = new Date();

        for (let i = days - 1; i >= 0; i--) {
            const date = new Date(now);
            date.setDate(date.getDate() - i);
            labels.push(date.toLocaleDateString());
            const dayStr = date.toLocaleDateString();
            data[days - 1 - i] = this.records.filter(r => r.date === dayStr).length;
        }

        return { labels, data };
    }

    showDetailsModal() {
        const modal = document.createElement('div');
        modal.className = 'visitor-modal';
        modal.innerHTML = `
            <div class="visitor-modal-content">
                <span class="close-btn">&times;</span>
                <h3>访问记录详情</h3>
                <div class="visitor-records">
                    ${this.records.reverse().map(record => `
                        <div class="visitor-record">
                            <div class="record-time">
                                <span class="record-date">${record.date}</span>
                                <span class="record-time">${record.time}</span>
                            </div>
                            <div class="record-info">
                                <div>页面: ${record.page}</div>
                                <div>来源: ${record.referrer}</div>
                                <div>设备: ${this.getDeviceInfo(record.userAgent)}</div>
                                <div>屏幕: ${record.screenSize}</div>
                            </div>
                        </div>
                    `).join('')}
                </div>
            </div>
        `;

        document.body.appendChild(modal);

        modal.querySelector('.close-btn').onclick = () => modal.remove();
        modal.onclick = (e) => {
            if (e.target === modal) modal.remove();
        };
    }

    getDeviceInfo(userAgent) {
        const ua = userAgent.toLowerCase();
        if (ua.includes('iphone') || ua.includes('ipad')) return 'iOS设备';
        if (ua.includes('android')) return 'Android设备';
        return 'PC设备';
    }

    bindEvents() {
        document.querySelector('.stats-toggle').onclick = () => {
            document.querySelector('.stats-panel').classList.toggle('show');
        };

        document.querySelector('.view-details-btn').onclick = () => {
            this.showDetailsModal();
        };
    }
}

// 添加样式
const style = document.createElement('style');
style.textContent = `
    .visitor-stats {
        position: fixed;
        bottom: 20px;
        left: 20px;
        z-index: 1000;
    }

    .stats-toggle {
        width: 40px;
        height: 40px;
        background: #ff6b6b;
        border-radius: 50%;
        display: flex;
        align-items: center;
        justify-content: center;
        cursor: pointer;
        box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);
        transition: transform 0.3s ease;
    }

    .stats-toggle:hover {
        transform: scale(1.1);
    }

    .stats-panel {
        position: absolute;
        bottom: 50px;
        left: 0;
        background: white;
        border-radius: 15px;
        padding: 20px;
        width: 300px;
        box-shadow: 0 5px 20px rgba(0, 0, 0, 0.1);
        display: none;
        transform: translateY(10px);
        opacity: 0;
        transition: all 0.3s ease;
    }

    .stats-panel.show {
        display: block;
        transform: translateY(0);
        opacity: 1;
    }

    .stats-content {
        margin: 15px 0;
    }

    .stats-item {
        display: flex;
        justify-content: space-between;
        margin: 10px 0;
    }

    .stats-value {
        color: #ff6b6b;
        font-weight: bold;
    }

    .stats-chart {
        height: 150px;
        margin: 20px 0;
    }

    .view-details-btn {
        width: 100%;
        padding: 10px;
        background: #ff6b6b;
        color: white;
        border: none;
        border-radius: 25px;
        cursor: pointer;
        transition: background 0.3s ease;
    }

    .view-details-btn:hover {
        background: #ff5252;
    }

    .visitor-modal {
        position: fixed;
        top: 0;
        left: 0;
        width: 100%;
        height: 100%;
        background: rgba(0, 0, 0, 0.5);
        display: flex;
        justify-content: center;
        align-items: center;
        z-index: 1001;
    }

    .visitor-modal-content {
        background: white;
        border-radius: 15px;
        padding: 20px;
        width: 90%;
        max-width: 600px;
        max-height: 80vh;
        overflow-y: auto;
    }

    .visitor-record {
        padding: 15px;
        border-bottom: 1px solid #eee;
    }

    .record-time {
        display: flex;
        justify-content: space-between;
        color: #666;
        margin-bottom: 10px;
    }

    .record-info {
        font-size: 0.9em;
        color: #333;
    }
`;

document.head.appendChild(style);

// 初始化访客记录
document.addEventListener('DOMContentLoaded', () => {
    window.visitorManager = new VisitorManager();
}); 