const mapConfig = {
    width: 800,
    height: 600,
    locations: [
        {
            name: "西湖",
            x: 400,
            y: 300,
            description: "美丽的西湖"
        },
        {
            name: "钱塘江",
            x: 450,
            y: 350,
            description: "壮观的钱塘江"
        }
        // 可以继续添加更多地点
    ]
};

class LocalMap {
    constructor(containerId) {
        this.container = document.getElementById(containerId);
        this.markers = [];
        this.init();
    }

    init() {
        // 创建SVG容器
        this.svg = document.createElementNS("http://www.w3.org/2000/svg", "svg");
        this.svg.setAttribute("width", mapConfig.width);
        this.svg.setAttribute("height", mapConfig.height);
        this.svg.style.background = "#f0f0f0";
        
        // 添加地图边框
        const border = document.createElementNS("http://www.w3.org/2000/svg", "rect");
        border.setAttribute("width", "100%");
        border.setAttribute("height", "100%");
        border.setAttribute("fill", "none");
        border.setAttribute("stroke", "#ccc");
        this.svg.appendChild(border);

        // 添加点击事件
        this.svg.addEventListener('click', (e) => {
            const rect = this.svg.getBoundingClientRect();
            const x = e.clientX - rect.left;
            const y = e.clientY - rect.top;
            this.addMarker(x, y);
        });

        this.container.appendChild(this.svg);
        this.renderExistingLocations();
    }

    renderExistingLocations() {
        mapConfig.locations.forEach(location => {
            this.addMarker(location.x, location.y, location);
        });
    }

    addMarker(x, y, data = null) {
        const marker = document.createElementNS("http://www.w3.org/2000/svg", "g");
        
        // 创建标记点
        const circle = document.createElementNS("http://www.w3.org/2000/svg", "circle");
        circle.setAttribute("cx", x);
        circle.setAttribute("cy", y);
        circle.setAttribute("r", "6");
        circle.setAttribute("fill", "#ff6b6b");
        
        // 创建标记文本
        const text = document.createElementNS("http://www.w3.org/2000/svg", "text");
        text.setAttribute("x", x + 10);
        text.setAttribute("y", y + 5);
        text.setAttribute("fill", "#333");
        text.textContent = data ? data.name : "新地点";

        marker.appendChild(circle);
        marker.appendChild(text);

        // 添加点击事件
        marker.addEventListener('click', () => {
            this.showLocationDetails(data || { x, y, name: "新地点" });
        });

        this.svg.appendChild(marker);
        this.markers.push(marker);
    }

    showLocationDetails(location) {
        const modal = document.createElement('div');
        modal.className = 'map-modal';
        modal.innerHTML = `
            <div class="map-modal-content">
                <span class="close-btn">&times;</span>
                <h3>${location.name}</h3>
                <div class="map-form">
                    <input type="date" id="visitDate" class="map-input" required>
                    <textarea id="visitDesc" class="map-input" placeholder="记录这里的故事..." rows="4"></textarea>
                    <div class="image-upload">
                        <label for="locationImages" class="upload-label">
                            <span>添加照片</span>
                            <input type="file" id="locationImages" accept="image/*" multiple>
                        </label>
                        <div id="imagePreview" class="image-preview"></div>
                    </div>
                    <div class="form-buttons">
                        <button class="save-btn">保存</button>
                        <button class="cancel-btn">取消</button>
                    </div>
                </div>
            </div>
        `;

        document.body.appendChild(modal);
        this.bindModalEvents(modal, location);
    }

    bindModalEvents(modal, location) {
        const closeBtn = modal.querySelector('.close-btn');
        const cancelBtn = modal.querySelector('.cancel-btn');
        const saveBtn = modal.querySelector('.save-btn');
        const imageInput = modal.querySelector('#locationImages');
        const imagePreview = modal.querySelector('#imagePreview');

        closeBtn.onclick = () => modal.remove();
        cancelBtn.onclick = () => modal.remove();

        imageInput.onchange = (e) => {
            imagePreview.innerHTML = '';
            Array.from(e.target.files).forEach(file => {
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
            const desc = document.getElementById('visitDesc').value;
            const images = Array.from(imagePreview.children).map(
                div => div.style.backgroundImage.slice(5, -2)
            );

            if (!date) {
                alert('请选择日期');
                return;
            }

            this.saveLocation({
                ...location,
                date,
                desc,
                images
            });

            modal.remove();
        };
    }

    saveLocation(locationData) {
        const savedLocations = JSON.parse(localStorage.getItem('mapLocations') || '[]');
        savedLocations.push(locationData);
        localStorage.setItem('mapLocations', JSON.stringify(savedLocations));
    }
} 