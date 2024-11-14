class PhotoManager {
    constructor() {
        this.photos = JSON.parse(localStorage.getItem('photos')) || [];
        this.currentFilter = 'all';
        this.init();
    }

    init() {
        this.renderPhotos();
        this.bindEvents();
    }

    bindEvents() {
        // 绑定上传按钮
        document.getElementById('uploadPhoto').addEventListener('click', () => {
            this.showUploadForm();
        });

        // 绑定筛选按钮
        document.querySelectorAll('.filter-btn').forEach(btn => {
            btn.addEventListener('click', (e) => {
                document.querySelectorAll('.filter-btn').forEach(b => 
                    b.classList.remove('active'));
                e.target.classList.add('active');
                this.currentFilter = e.target.textContent.toLowerCase();
                this.renderPhotos();
            });
        });
    }

    showUploadForm() {
        const modal = document.createElement('div');
        modal.className = 'photo-modal';
        modal.innerHTML = `
            <div class="photo-modal-content">
                <span class="close-btn">&times;</span>
                <h3>上传照片</h3>
                <div class="photo-form">
                    <input type="date" id="photoDate" class="photo-input" required>
                    <input type="text" id="photoTitle" class="photo-input" placeholder="标题" required>
                    <textarea id="photoDesc" class="photo-input" placeholder="描述这张照片..." rows="3"></textarea>
                    <select id="photoCategory" class="photo-input">
                        <option value="2024">2024</option>
                        <option value="travel">旅行</option>
                        <option value="daily">日常</option>
                    </select>
                    <div class="image-upload">
                        <label for="photoFile" class="upload-label">
                            <span>选择照片</span>
                            <input type="file" id="photoFile" accept="image/*" required>
                        </label>
                        <div id="photoPreview" class="photo-preview"></div>
                    </div>
                    <div class="form-buttons">
                        <button class="save-btn">保存</button>
                        <button class="cancel-btn">取消</button>
                    </div>
                </div>
            </div>
        `;

        document.body.appendChild(modal);

        // 绑定关闭按钮
        modal.querySelector('.close-btn').onclick = () => modal.remove();
        modal.querySelector('.cancel-btn').onclick = () => modal.remove();

        // 绑定图片预览
        const photoInput = modal.querySelector('#photoFile');
        const photoPreview = modal.querySelector('#photoPreview');
        photoInput.onchange = (e) => {
            const file = e.target.files[0];
            if (file) {
                const reader = new FileReader();
                reader.onload = (e) => {
                    photoPreview.innerHTML = `
                        <div class="preview-image" style="background-image: url(${e.target.result})"></div>
                    `;
                };
                reader.readAsDataURL(file);
            }
        };

        // 绑定保存按钮
        modal.querySelector('.save-btn').onclick = () => {
            const date = modal.querySelector('#photoDate').value;
            const title = modal.querySelector('#photoTitle').value;
            const desc = modal.querySelector('#photoDesc').value;
            const category = modal.querySelector('#photoCategory').value;
            const preview = modal.querySelector('.preview-image');

            if (!date || !title || !preview) {
                alert('请填写完整信息并选择照片');
                return;
            }

            this.addPhoto({
                date,
                title,
                desc,
                category,
                image: preview.style.backgroundImage.slice(5, -2),
                timestamp: new Date().getTime()
            });

            modal.remove();
        };

        // 点击模态框外部关闭
        modal.onclick = (e) => {
            if (e.target === modal) {
                modal.remove();
            }
        };
    }

    addPhoto(photo) {
        this.photos.unshift(photo);
        localStorage.setItem('photos', JSON.stringify(this.photos));
        this.renderPhotos();
    }

    deletePhoto(index) {
        if (confirm('确定要删除这张照片吗？')) {
            this.photos.splice(index, 1);
            localStorage.setItem('photos', JSON.stringify(this.photos));
            this.renderPhotos();
        }
    }

    renderPhotos() {
        const grid = document.querySelector('.photo-grid');
        grid.innerHTML = '';

        const filteredPhotos = this.currentFilter === 'all' 
            ? this.photos 
            : this.photos.filter(photo => photo.category === this.currentFilter);

        filteredPhotos.forEach((photo, index) => {
            const photoElement = document.createElement('div');
            photoElement.className = 'photo-item';
            photoElement.innerHTML = `
                <div class="photo-header">
                    <div class="photo-date">${photo.date}</div>
                    <button class="delete-photo-btn" data-index="${index}">×</button>
                </div>
                <div class="photo-image" style="background-image: url(${photo.image})"></div>
                <div class="photo-info">
                    <h3>${photo.title}</h3>
                    ${photo.desc ? `<p class="photo-desc">${photo.desc}</p>` : ''}
                </div>
            `;

            // 绑定删除按钮事件
            const deleteBtn = photoElement.querySelector('.delete-photo-btn');
            deleteBtn.addEventListener('click', (e) => {
                e.stopPropagation();
                this.deletePhoto(index);
            });

            // 绑定点击查看大图事件
            photoElement.querySelector('.photo-image').addEventListener('click', () => {
                this.showLargePhoto(photo);
            });

            grid.appendChild(photoElement);
        });
    }

    showLargePhoto(photo) {
        const modal = document.createElement('div');
        modal.className = 'photo-view-modal';
        modal.innerHTML = `
            <div class="photo-view-content">
                <span class="close-btn">&times;</span>
                <img src="${photo.image}" alt="${photo.title}">
                <div class="photo-view-info">
                    <h3>${photo.title}</h3>
                    <p class="photo-date">${photo.date}</p>
                    ${photo.desc ? `<p class="photo-desc">${photo.desc}</p>` : ''}
                </div>
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
    new PhotoManager();
}); 