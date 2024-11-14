class Calendar {
    constructor() {
        this.currentDate = new Date();
        this.selectedDate = null;
        this.events = JSON.parse(localStorage.getItem('calendarEvents')) || {};
        this.lunar = new Lunar();
        this.init();
    }

    init() {
        this.renderCalendar();
        this.bindEvents();
    }

    bindEvents() {
        // 绑定上下月按钮事件
        document.getElementById('prevMonth').addEventListener('click', () => {
            this.currentDate.setMonth(this.currentDate.getMonth() - 1);
            this.renderCalendar();
        });

        document.getElementById('nextMonth').addEventListener('click', () => {
            this.currentDate.setMonth(this.currentDate.getMonth() + 1);
            this.renderCalendar();
        });

        // 绑定阴阳历切换事件
        document.querySelectorAll('.type-btn').forEach(btn => {
            btn.addEventListener('click', (e) => {
                document.querySelectorAll('.type-btn').forEach(b => b.classList.remove('active'));
                e.target.classList.add('active');
                this.renderCalendar();
            });
        });

        // 绑定模态框关闭事件
        document.querySelector('.close-btn').addEventListener('click', () => {
            document.getElementById('eventModal').style.display = 'none';
        });

        // 点击模态框外部关闭
        window.addEventListener('click', (e) => {
            const modal = document.getElementById('eventModal');
            if (e.target === modal) {
                modal.style.display = 'none';
            }
        });

        // 绑定添加事件按钮
        document.getElementById('addEvent').addEventListener('click', () => {
            this.showAddEventForm();
        });
    }

    renderCalendar() {
        const year = this.currentDate.getFullYear();
        const month = this.currentDate.getMonth();
        
        // 更新月份显示
        document.getElementById('currentMonth').textContent = 
            `${year}年 ${month + 1}月`;

        const firstDay = new Date(year, month, 1);
        const lastDay = new Date(year, month + 1, 0);
        const daysInMonth = lastDay.getDate();
        const startingDay = firstDay.getDay();

        const calendarDays = document.getElementById('calendarDays');
        calendarDays.innerHTML = '';

        // 添加空白天数
        for (let i = 0; i < startingDay; i++) {
            const emptyDay = document.createElement('div');
            emptyDay.className = 'calendar-day empty';
            calendarDays.appendChild(emptyDay);
        }

        // 添加日期
        for (let day = 1; day <= daysInMonth; day++) {
            const dayElement = document.createElement('div');
            dayElement.className = 'calendar-day';
            
            const dateStr = this.formatDate(year, month + 1, day);
            
            // 获取农历信息
            const lunarInfo = this.lunar.getLunarDate(year, month + 1, day);
            
            // 创建阳历日期元素
            const solarDate = document.createElement('div');
            solarDate.className = 'solar-date';
            solarDate.textContent = day;
            
            // 创建农历日期元素
            const lunarDate = document.createElement('div');
            lunarDate.className = 'lunar-date';
            
            // 获取节日信息
            const festivals = this.lunar.getAllFestivals(year, month + 1, day, lunarInfo);
            if (festivals.length > 0) {
                lunarDate.textContent = festivals[0]; // 显示第一个节日
                lunarDate.classList.add('festival');
            } else {
                lunarDate.textContent = lunarInfo.day;
            }

            // 判断是否是今天
            const today = new Date();
            if (year === today.getFullYear() && 
                month === today.getMonth() && 
                day === today.getDate()) {
                dayElement.classList.add('today');
            }

            // 如果有事件，添加标记
            if (this.events[dateStr]) {
                dayElement.classList.add('has-event');
            }

            dayElement.appendChild(solarDate);
            dayElement.appendChild(lunarDate);

            dayElement.addEventListener('click', () => this.showEventModal(dateStr));
            calendarDays.appendChild(dayElement);
        }
    }

    formatDate(year, month, day) {
        return `${year}-${String(month).padStart(2, '0')}-${String(day).padStart(2, '0')}`;
    }

    showEventModal(dateStr) {
        const modal = document.getElementById('eventModal');
        const [year, month, day] = dateStr.split('-').map(Number);
        const lunarInfo = this.lunar.getLunarDate(year, month, day);
        const festivals = this.lunar.getAllFestivals(year, month, day, lunarInfo);

        document.getElementById('selectedDate').textContent = `${year}年${month}月${day}日`;
        document.getElementById('lunarDate').textContent = 
            `${lunarInfo.year} ${lunarInfo.month}${lunarInfo.day}`;
        document.getElementById('solarTerm').textContent = lunarInfo.solarTerm || '无';
        document.getElementById('festivals').textContent = festivals.length > 0 ? festivals.join('、') : '无';

        this.renderEvents(dateStr);
        modal.style.display = 'block';
    }

    showAddEventForm() {
        const date = document.getElementById('selectedDate').textContent;
        const existingForm = document.querySelector('.event-form');
        if (existingForm) {
            existingForm.remove();
        }

        const form = document.createElement('div');
        form.className = 'event-form';
        form.innerHTML = `
            <h4>添加新事件</h4>
            <input type="text" id="eventTitle" placeholder="事件标题" class="event-input">
            <textarea id="eventDesc" placeholder="事件描述" class="event-input"></textarea>
            <div class="event-form-buttons">
                <button class="save-btn">保存</button>
                <button class="cancel-btn">取消</button>
            </div>
        `;

        const eventsList = document.getElementById('eventsList');
        eventsList.appendChild(form);

        // 绑定保存事件
        form.querySelector('.save-btn').addEventListener('click', () => {
            const title = document.getElementById('eventTitle').value.trim();
            const desc = document.getElementById('eventDesc').value.trim();
            
            if (!title) {
                alert('请输入事件标题');
                return;
            }

            const dateStr = this.formatDateFromText(date);
            if (!this.events[dateStr]) {
                this.events[dateStr] = [];
            }

            this.events[dateStr].push({
                title,
                desc,
                timestamp: new Date().getTime()
            });

            localStorage.setItem('calendarEvents', JSON.stringify(this.events));
            this.renderEvents(dateStr);
            this.renderCalendar();
            form.remove();
        });

        form.querySelector('.cancel-btn').addEventListener('click', () => {
            form.remove();
        });
    }

    formatDateFromText(dateText) {
        // 将 "2024年3月14日" 转换为 "2024-03-14" 格式
        const matches = dateText.match(/(\d+)年(\d+)月(\d+)日/);
        if (matches) {
            const [_, year, month, day] = matches;
            return this.formatDate(year, month, day);
        }
        return '';
    }

    renderEvents(dateStr) {
        const eventsList = document.getElementById('eventsList');
        eventsList.innerHTML = '';

        if (this.events[dateStr] && this.events[dateStr].length > 0) {
            this.events[dateStr].forEach((event, index) => {
                const eventDiv = document.createElement('div');
                eventDiv.className = 'event-item';
                eventDiv.innerHTML = `
                    <h5>${event.title}</h5>
                    ${event.desc ? `<p>${event.desc}</p>` : ''}
                    <button class="delete-btn" data-index="${index}">删除</button>
                `;

                eventDiv.querySelector('.delete-btn').addEventListener('click', (e) => {
                    const index = e.target.dataset.index;
                    this.events[dateStr].splice(index, 1);
                    if (this.events[dateStr].length === 0) {
                        delete this.events[dateStr];
                    }
                    localStorage.setItem('calendarEvents', JSON.stringify(this.events));
                    this.renderEvents(dateStr);
                    this.renderCalendar();
                });

                eventsList.appendChild(eventDiv);
            });
        }
    }

    getFestivals(dateStr, lunarInfo) {
        const [_, month, day] = dateStr.split('-');
        const solarFestival = this.lunar.festivals.solar[`${month}-${day}`];
        const lunarFestival = lunarInfo.festival;
        
        const festivals = [];
        if (solarFestival) festivals.push(solarFestival);
        if (lunarFestival) festivals.push(lunarFestival);
        if (lunarInfo.solarTerm) festivals.push(lunarInfo.solarTerm);
        
        return festivals.join('、');
    }
}

// 初始化日历
document.addEventListener('DOMContentLoaded', () => {
    const calendar = new Calendar();
}); 