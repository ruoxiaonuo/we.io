class VisitorManager{static STORAGE_KEY="visitorRecords";constructor(){this.records=this.loadRecords(),this.init()}init(){this.addVisitRecord(),this.renderVisitorStats(),this.bindEvents()}loadRecords(){return JSON.parse(localStorage.getItem(VisitorManager.STORAGE_KEY)||"[]")}saveRecords(){localStorage.setItem(VisitorManager.STORAGE_KEY,JSON.stringify(this.records))}addVisitRecord(){var t=new Date,t={timestamp:t.getTime(),date:t.toLocaleDateString(),time:t.toLocaleTimeString(),page:window.location.pathname,userAgent:navigator.userAgent,screenSize:window.innerWidth+"x"+window.innerHeight,referrer:document.referrer||"Direct"};this.records.push(t),this.saveRecords(),this.updateVisitCount()}updateVisitCount(){var t=document.getElementById("visitCount");t&&(t.textContent=this.records.length)}renderVisitorStats(){var t=document.createElement("div");t.className="visitor-stats",t.innerHTML=`
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
        `,document.body.appendChild(t),this.renderVisitsChart()}getTodayVisits(){let e=(new Date).toLocaleDateString();return this.records.filter(t=>t.date===e).length}getWeekVisits(){let e=new Date;return e.setDate(e.getDate()-7),this.records.filter(t=>new Date(t.timestamp)>e).length}renderVisitsChart(){var t=this.getChartData(),e=document.createElement("canvas"),e=(e.id="visitsChartCanvas",document.getElementById("visitsChart").appendChild(e),e.getContext("2d")),s=e.createLinearGradient(0,0,0,150);s.addColorStop(0,"rgba(255, 107, 107, 0.5)"),s.addColorStop(1,"rgba(255, 107, 107, 0.1)"),new Chart(e,{type:"line",data:{labels:t.labels,datasets:[{label:"访问量",data:t.data,fill:!0,backgroundColor:s,borderColor:"#ff6b6b",tension:.4}]},options:{responsive:!0,maintainAspectRatio:!1,plugins:{legend:{display:!1}},scales:{y:{beginAtZero:!0,ticks:{stepSize:1}}}}})}getChartData(){var s=new Array(7).fill(0),i=[],a=new Date;for(let t=6;0<=t;t--){var r=new Date(a);r.setDate(r.getDate()-t),i.push(r.toLocaleDateString());let e=r.toLocaleDateString();s[6-t]=this.records.filter(t=>t.date===e).length}return{labels:i,data:s}}showDetailsModal(){let e=document.createElement("div");e.className="visitor-modal",e.innerHTML=`
            <div class="visitor-modal-content">
                <span class="close-btn">&times;</span>
                <h3>访问记录详情</h3>
                <div class="visitor-records">
                    ${this.records.reverse().map(t=>`
                        <div class="visitor-record">
                            <div class="record-time">
                                <span class="record-date">${t.date}</span>
                                <span class="record-time">${t.time}</span>
                            </div>
                            <div class="record-info">
                                <div>页面: ${t.page}</div>
                                <div>来源: ${t.referrer}</div>
                                <div>设备: ${this.getDeviceInfo(t.userAgent)}</div>
                                <div>屏幕: ${t.screenSize}</div>
                            </div>
                        </div>
                    `).join("")}
                </div>
            </div>
        `,document.body.appendChild(e),e.querySelector(".close-btn").onclick=()=>e.remove(),e.onclick=t=>{t.target===e&&e.remove()}}getDeviceInfo(t){t=t.toLowerCase();return t.includes("iphone")||t.includes("ipad")?"iOS设备":t.includes("android")?"Android设备":"PC设备"}bindEvents(){document.querySelector(".stats-toggle").onclick=()=>{document.querySelector(".stats-panel").classList.toggle("show")},document.querySelector(".view-details-btn").onclick=()=>{this.showDetailsModal()}}}let style=document.createElement("style");style.textContent=`
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
`,document.head.appendChild(style),document.addEventListener("DOMContentLoaded",()=>{window.visitorManager=new VisitorManager});