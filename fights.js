class FightManager {
    constructor() {
        this.fights = JSON.parse(localStorage.getItem('fights')) || [];
        this.init();
    }

    init() {
        this.renderFights();
        this.bindEvents();
    }

    bindEvents() {
        document.getElementById('addFight').addEventListener('click', () => {
            this.showAddFightForm();
        });
    }

    showAddFightForm() {
        const modal = document.createElement('div');
        modal.className = 'fight-modal';
        modal.innerHTML = `
            <div class="fight-modal-content">
                <span class="close-btn">&times;</span>
                <h3>记录新争吵</h3>
                <div class="fight-form">
                    <input type="date" id="fightDate" class="fight-input" required>
                    <input type="text" id="fightReason" class="fight-input" placeholder="争吵原因" required>
                    <textarea id="fightDesc" class="fight-input" placeholder="详细描述..." rows="3"></textarea>
                    <textarea id="fightSolution" class="fight-input" placeholder="解决方案..." rows="3"></textarea>
                    <select id="fightStatus" class="fight-input">
                        <option value="resolved">已解决</option>
                        <option value="ongoing">未解决</option>
                    </select>
                    <div class="image-upload">
                        <label for="fightImages" class="upload-label">
                            <span>添加照片</span>
                            <input type="file" id="fightImages" accept="image/*" multiple>
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

        modal.querySelector('.close-btn').onclick = () => modal.remove();
        modal.querySelector('.cancel-btn').onclick = () => modal.remove();

        const imageInput = modal.querySelector('#fightImages');
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

        modal.querySelector('.save-btn').onclick = () => {
            const date = modal.querySelector('#fightDate').value;
            const reason = modal.querySelector('#fightReason').value;
            const desc = modal.querySelector('#fightDesc').value;
            const solution = modal.querySelector('#fightSolution').value;
            const status = modal.querySelector('#fightStatus').value;
            const images = Array.from(imagePreview.children).map(
                div => div.style.backgroundImage.slice(5, -2)
            );

            if (!date || !reason) {
                alert('请填写日期和争吵原因');
                return;
            }

            this.addFight({
                date,
                reason,
                desc,
                solution,
                status,
                images,
                timestamp: new Date().getTime()
            });

            modal.remove();
        };

        modal.onclick = (e) => {
            if (e.target === modal) {
                modal.remove();
            }
        };
    }

    addFight(fight) {
        this.fights.unshift(fight);
        localStorage.setItem('fights', JSON.stringify(this.fights));
        this.renderFights();
    }

    deleteFight(index) {
        if (confirm('确定要删除这条记录吗？')) {
            this.fights.splice(index, 1);
            localStorage.setItem('fights', JSON.stringify(this.fights));
            this.renderFights();
        }
    }

    renderFights() {
        const timeline = document.querySelector('.fights-timeline');
        timeline.innerHTML = '';

        this.fights.forEach((fight, index) => {
            const card = document.createElement('div');
            card.className = 'fight-card';
            card.innerHTML = `
                <div class="fight-header">
                    <div class="fight-date">${fight.date}</div>
                    <button class="delete-fight-btn" data-index="${index}">×</button>
                </div>
                <h3 class="fight-reason">${fight.reason}</h3>
                ${fight.desc ? `<p class="fight-desc">${fight.desc}</p>` : ''}
                ${fight.solution ? `<p class="fight-solution">解决方案：${fight.solution}</p>` : ''}
                ${fight.images && fight.images.length > 0 ? `
                    <div class="fight-images">
                        ${fight.images.map(img => `
                            <div class="fight-image" style="background-image: url(${img})"></div>
                        `).join('')}
                    </div>
                ` : ''}
                <div class="fight-status status-${fight.status}">
                    ${fight.status === 'resolved' ? '已解决' : '未解决'}
                </div>
            `;

            const deleteBtn = card.querySelector('.delete-fight-btn');
            deleteBtn.addEventListener('click', (e) => {
                e.stopPropagation();
                this.deleteFight(index);
            });

            const images = card.querySelectorAll('.fight-image');
            images.forEach(img => {
                img.addEventListener('click', () => {
                    this.showLargeImage(img.style.backgroundImage.slice(5, -2));
                });
            });

            timeline.appendChild(card);
        });
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

document.addEventListener('DOMContentLoaded', () => {
    new FightManager();
}); 