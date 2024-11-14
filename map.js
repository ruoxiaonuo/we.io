class MapManager {
    constructor() {
        this.mapData = JSON.parse(localStorage.getItem('mapData')) || [];
        this.map = null;
        this.currentMarker = null;
        this.init();
    }

    init() {
        this.initMap();
        this.updateStats();
        this.bindEvents();
    }

    initMap() {
        // 创建百度地图实例
        this.map = new BMap.Map("baiduMap");
        
        // 创建中心点坐标（默认杭州）
        const point = new BMap.Point(120.161, 30.279);
        
        // 初始化地图，设置中心点坐标和地图级别
        this.map.centerAndZoom(point, 12);
        
        // 开启鼠标滚轮缩放
        this.map.enableScrollWheelZoom(true);
        
        // 添加地图控件
        this.map.addControl(new BMap.NavigationControl());
        this.map.addControl(new BMap.ScaleControl());
        this.map.addControl(new BMap.OverviewMapControl());
        
        // 绑定地图点击事件
        this.map.addEventListener("click", (e) => {
            this.showAddLocationForm(e.point);
        });

        // 渲染已有标记
        this.renderMarkers();
    }

    renderMarkers() {
        this.mapData.forEach(location => {
            const point = new BMap.Point(location.lng, location.lat);
            const marker = new BMap.Marker(point);
            
            // 创建信息窗口
            const infoWindow = new BMap.InfoWindow(this.createInfoWindowContent(location));
            
            // 绑定点击事件
            marker.addEventListener("click", () => {
                this.map.openInfoWindow(infoWindow, point);
            });
            
            this.map.addOverlay(marker);
        });
    }

    createInfoWindowContent(location) {
        return `
            <div class="map-info-window">
                <h4>${location.name}</h4>
                <p class="info-date">${location.date}</p>
                <p class="info-address">${location.address}</p>
                ${location.description ? `<p class="info-desc">${location.description}</p>` : ''}
                ${location.images && location.images.length > 0 ? `
                    <div class="info-images">
                        ${location.images.map(img => `
                            <img src="${img}" alt="照片" onclick="showLargeImage('${img}')">
                        `).join('')}
                    </div>
                ` : ''}
                <button onclick="deleteLocation('${location.id}')" class="delete-btn">删除</button>
            </div>
        `;
    }

    showAddLocationForm(point) {
        const modal = document.getElementById('mapModal');
        modal.style.display = 'block';
        
        // 保存当前坐标点
        this.currentMarker = point;

        // 根据坐标获取地址信息
        const geocoder = new BMap.Geocoder();
        geocoder.getLocation(point, (result) => {
            if (result) {
                document.getElementById('locationAddress').value = result.address;
            }
        });

        this.bindFormEvents();
    }

    bindFormEvents() {
        const modal = document.getElementById('mapModal');
        const closeBtn = modal.querySelector('.close-btn');
        const cancelBtn = modal.querySelector('.cancel-btn');
        const saveBtn = modal.querySelector('.save-btn');
        const imageInput = modal.querySelector('#locationImages');
        const imagePreview = modal.querySelector('#imagePreview');

        closeBtn.onclick = () => modal.style.display = 'none';
        cancelBtn.onclick = () => modal.style.display = 'none';
        
        window.onclick = (e) => {
            if (e.target === modal) {
                modal.style.display = 'none';
            }
        };

        imageInput.onchange = (e) => {
            imagePreview.innerHTML = '';
            const files = Array.from(e.target.files);
            files.forEach(file => {
                const reader = new FileReader();
                reader.onload = (e) => {
                    const img = document.createElement('div');
                    img.className = 'preview-image';
                    img.style.backgroundImage = `url(${e.target.result})`;
                    imagePreview.appendChild(img);
                };
                reader.readAsDataURL(file);
            });
        };

        saveBtn.onclick = () => {
            const date = document.getElementById('visitDate').value;
            const name = document.getElementById('locationName').value;
            const description = document.getElementById('visitDesc').value;
            const images = Array.from(imagePreview.children).map(
                div => div.style.backgroundImage.slice(5, -2)
            );

            if (!date || !name) {
                alert('请填写日期和地点');
                return;
            }

            this.addLocation({
                date,
                name,
                description,
                images,
                timestamp: new Date().getTime()
            });

            modal.style.display = 'none';
        };
    }

    addLocation(location) {
        location.id = Date.now().toString(); // 添加唯一ID
        location.lng = this.currentMarker.lng;
        location.lat = this.currentMarker.lat;
        
        this.mapData.push(location);
        localStorage.setItem('mapData', JSON.stringify(this.mapData));
        
        // 添加新标记
        const point = new BMap.Point(location.lng, location.lat);
        const marker = new BMap.Marker(point);
        const infoWindow = new BMap.InfoWindow(this.createInfoWindowContent(location));
        
        marker.addEventListener("click", () => {
            this.map.openInfoWindow(infoWindow, point);
        });
        
        this.map.addOverlay(marker);
        this.updateStats();
    }

    deleteLocation(id) {
        if (confirm('确定要删除这个地点吗？')) {
            const index = this.mapData.findIndex(item => item.id === id);
            if (index > -1) {
                this.mapData.splice(index, 1);
                localStorage.setItem('mapData', JSON.stringify(this.mapData));
                this.map.clearOverlays();
                this.renderMarkers();
                this.updateStats();
            }
        }
    }

    updateStats() {
        document.getElementById('visitedCount').textContent = this.mapData.length;
        const memoryCount = this.mapData.reduce((sum, location) => {
            return sum + (location.images ? location.images.length : 0);
        }, 0);
        document.getElementById('memoryCount').textContent = memoryCount;
    }

    showLargeImage(imageUrl) {
        const modal = document.createElement('div');
        modal.className = 'image-view-modal';
        modal.innerHTML = `
            <div class="image-view-content">
                <span class="close-btn">&times;</span>
                <img src="${imageUrl}" alt="照片">
            </div>
        `;

        document.body.appendChild(modal);

        modal.querySelector('.close-btn').onclick = () => modal.remove();
        modal.onclick = (e) => {
            if (e.target === modal) {
                modal.remove();
            }
        };
    }
}

// 初始化
document.addEventListener('DOMContentLoaded', () => {
    new MapManager();
});

// 为了让删除和查看大图功能在信息窗口中工作
window.deleteLocation = (id) => {
    window.mapManager.deleteLocation(id);
};

window.showLargeImage = (imageUrl) => {
    window.mapManager.showLargeImage(imageUrl);
}; 