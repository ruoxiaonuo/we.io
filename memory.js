class MemoryManager {
    constructor() {
        this.memories = JSON.parse(localStorage.getItem('memories')) || [];
        this.init();
    }

    init() {
        this.renderMemories();
        this.bindEvents();
    }

    bindEvents() {
        document.getElementById('addMemory').addEventListener('click', () => {
            this.showAddMemoryForm();
        });
    }

    showAddMemoryForm() {
        const modal = document.createElement('div');
        modal.className = 'memory-modal';
        modal.innerHTML = `
            <div class="memory-modal-content">
                <span class="close-btn">&times;</span>
                <h3>记录新回忆</h3>
                <div class="memory-form">
                    <input type="date" id="memoryDate" class="memory-input" required>
                    <input type="text" id="memoryTitle" class="memory-input" placeholder="标题" required>
                    <textarea id="memoryContent" class="memory-input" placeholder="写下这个美好的瞬间..." rows="4" required></textarea>
                    <div class="image-upload">
                        <label for="memoryImage" class="upload-label">
                            <span>添加图片</span>
                            <input type="file" id="memoryImage" accept="image/*" multiple>
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

        // 绑定关闭按钮
        modal.querySelector('.close-btn').onclick = () => modal.remove();
        modal.querySelector('.cancel-btn').onclick = () => modal.remove();

        // 绑定图片预览
        const imageInput = modal.querySelector('#memoryImage');
        const imagePreview = modal.querySelector('#imagePreview');
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

        // 绑定保存按钮
        modal.querySelector('.save-btn').onclick = () => {
            const date = modal.querySelector('#memoryDate').value;
            const title = modal.querySelector('#memoryTitle').value;
            const content = modal.querySelector('#memoryContent').value;
            const images = Array.from(imagePreview.children).map(
                div => div.style.backgroundImage.slice(5, -2)
            );

            if (!date || !title || !content) {
                alert('请填写完整信息');
                return;
            }

            this.addMemory({
                date,
                title,
                content,
                images,
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

    addMemory(memory) {
        this.memories.unshift(memory);
        localStorage.setItem('memories', JSON.stringify(this.memories));
        this.renderMemories();
    }

    deleteMemory(index) {
        // 添加删除确认
        if (confirm('确定要删除这条回忆吗？')) {
            this.memories.splice(index, 1);
            localStorage.setItem('memories', JSON.stringify(this.memories));
            this.renderMemories();
        }
    }

    renderMemories() {
        const timeline = document.querySelector('.memory-timeline');
        timeline.innerHTML = '';

        this.memories.forEach((memory, index) => {
            const card = document.createElement('div');
            card.className = 'memory-card';
            card.innerHTML = `
                <div class="memory-header">
                    <div class="memory-date">${memory.date}</div>
                    <button class="delete-memory-btn" data-index="${index}">×</button>
                </div>
                <div class="memory-content">
                    <h3>${memory.title}</h3>
                    <p>${memory.content}</p>
                    ${memory.images && memory.images.length > 0 ? `
                        <div class="memory-images">
                            ${memory.images.map(img => `
                                <div class="memory-image" style="background-image: url(${img})"></div>
                            `).join('')}
                        </div>
                    ` : ''}
                </div>
            `;

            // 绑定删除按钮事件
            const deleteBtn = card.querySelector('.delete-memory-btn');
            deleteBtn.addEventListener('click', (e) => {
                e.stopPropagation();
                this.deleteMemory(index);
            });

            timeline.appendChild(card);
        });
    }
}

// 初始化
document.addEventListener('DOMContentLoaded', () => {
    new MemoryManager();
}); 