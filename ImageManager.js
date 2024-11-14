class ImageManager {
    static async handleUpload(files, options = {}) {
        const defaultOptions = {
            maxSize: 1024 * 1024, // 1MB
            maxWidth: 1920,
            maxHeight: 1080,
            quality: 0.8,
            allowedTypes: ['image/jpeg', 'image/png', 'image/webp']
        };

        const settings = { ...defaultOptions, ...options };
        const processedImages = [];

        for (const file of files) {
            try {
                // 检查文件类型
                if (!settings.allowedTypes.includes(file.type)) {
                    throw new Error('不支持的文件类型');
                }

                // 处理图片
                const processedImage = await this.processImage(file, settings);
                processedImages.push(processedImage);

            } catch (error) {
                console.error('图片处理失败:', error);
                UIManager.showToast(`图片 ${file.name} 处理失败: ${error.message}`, 'error');
            }
        }

        return processedImages;
    }

    static processImage(file, settings) {
        return new Promise((resolve, reject) => {
            const reader = new FileReader();
            reader.onload = (e) => {
                const img = new Image();
                img.onload = () => {
                    try {
                        const { width, height, dataUrl } = this.resizeImage(img, settings);
                        resolve({
                            original: file,
                            width,
                            height,
                            dataUrl,
                            size: this.getDataUrlSize(dataUrl)
                        });
                    } catch (error) {
                        reject(error);
                    }
                };
                img.onerror = () => reject(new Error('图片加载失败'));
                img.src = e.target.result;
            };
            reader.onerror = () => reject(new Error('文件读取失败'));
            reader.readAsDataURL(file);
        });
    }

    static resizeImage(img, settings) {
        const canvas = document.createElement('canvas');
        let { width, height } = img;

        // 计算新的尺寸
        if (width > settings.maxWidth || height > settings.maxHeight) {
            const ratio = Math.min(
                settings.maxWidth / width,
                settings.maxHeight / height
            );
            width *= ratio;
            height *= ratio;
        }

        canvas.width = width;
        canvas.height = height;

        const ctx = canvas.getContext('2d');
        ctx.drawImage(img, 0, 0, width, height);

        return {
            width,
            height,
            dataUrl: canvas.toDataURL('image/jpeg', settings.quality)
        };
    }

    static getDataUrlSize(dataUrl) {
        const base64 = dataUrl.split(',')[1];
        return Math.round((base64.length * 3) / 4);
    }

    static showPreview(container, images) {
        container.innerHTML = '';
        images.forEach(image => {
            const preview = document.createElement('div');
            preview.className = 'preview-image';
            preview.style.backgroundImage = `url(${image.dataUrl})`;
            
            // 添加删除按钮
            const deleteBtn = document.createElement('button');
            deleteBtn.className = 'preview-delete-btn';
            deleteBtn.innerHTML = '×';
            deleteBtn.onclick = (e) => {
                e.stopPropagation();
                preview.remove();
            };

            preview.appendChild(deleteBtn);
            container.appendChild(preview);
        });
    }

    static showLightbox(imageUrl) {
        const lightbox = document.createElement('div');
        lightbox.className = 'lightbox';
        lightbox.innerHTML = `
            <div class="lightbox-content">
                <span class="close-btn">&times;</span>
                <img src="${imageUrl}" alt="大图">
                <div class="lightbox-controls">
                    <button class="rotate-btn" data-rotate="-90">↺</button>
                    <button class="rotate-btn" data-rotate="90">↻</button>
                    <button class="zoom-btn" data-zoom="out">−</button>
                    <button class="zoom-btn" data-zoom="in">+</button>
                </div>
            </div>
        `;

        document.body.appendChild(lightbox);

        let rotation = 0;
        let scale = 1;
        const img = lightbox.querySelector('img');

        // 绑定旋转和缩放事件
        lightbox.querySelectorAll('.rotate-btn').forEach(btn => {
            btn.onclick = () => {
                rotation += parseInt(btn.dataset.rotate);
                img.style.transform = `rotate(${rotation}deg) scale(${scale})`;
            };
        });

        lightbox.querySelectorAll('.zoom-btn').forEach(btn => {
            btn.onclick = () => {
                scale *= btn.dataset.zoom === 'in' ? 1.2 : 0.8;
                img.style.transform = `rotate(${rotation}deg) scale(${scale})`;
            };
        });

        // 绑定关闭事件
        lightbox.querySelector('.close-btn').onclick = () => lightbox.remove();
        lightbox.onclick = (e) => {
            if (e.target === lightbox) lightbox.remove();
        };
    }
} 