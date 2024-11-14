class ValidationManager {
    static RULES = {
        required: {
            validate: value => value !== null && value !== undefined && value.toString().trim() !== '',
            message: '此项为必填项'
        },
        date: {
            validate: value => !isNaN(new Date(value).getTime()),
            message: '请输入有效的日期'
        },
        minLength: (min) => ({
            validate: value => value.length >= min,
            message: `最少需要${min}个字符`
        }),
        maxLength: (max) => ({
            validate: value => value.length <= max,
            message: `最多允许${max}个字符`
        }),
        imageSize: (maxSize) => ({
            validate: file => file.size <= maxSize,
            message: `图片大小不能超过${maxSize / 1024 / 1024}MB`
        }),
        imageType: {
            validate: file => ['image/jpeg', 'image/png', 'image/webp'].includes(file.type),
            message: '只支持 JPG、PNG、WEBP 格式的图片'
        }
    };

    static validateForm(formData, rules) {
        const errors = {};
        
        for (const [field, fieldRules] of Object.entries(rules)) {
            const value = formData[field];
            
            for (const rule of fieldRules) {
                let validator;
                let params;

                if (typeof rule === 'string') {
                    validator = this.RULES[rule];
                } else if (typeof rule === 'function') {
                    validator = rule;
                } else {
                    [validator, params] = rule;
                }

                const isValid = params 
                    ? this.RULES[validator](params).validate(value)
                    : validator.validate(value);

                if (!isValid) {
                    errors[field] = params 
                        ? this.RULES[validator](params).message 
                        : validator.message;
                    break;
                }
            }
        }

        return {
            isValid: Object.keys(errors).length === 0,
            errors
        };
    }

    static showErrors(errors, formElement) {
        // 清除之前的错误提示
        formElement.querySelectorAll('.error-message').forEach(el => el.remove());
        formElement.querySelectorAll('.error-input').forEach(el => {
            el.classList.remove('error-input');
        });

        // 显示新的错误提示
        for (const [field, message] of Object.entries(errors)) {
            const input = formElement.querySelector(`[name="${field}"]`);
            if (input) {
                input.classList.add('error-input');
                
                const errorDiv = document.createElement('div');
                errorDiv.className = 'error-message';
                errorDiv.textContent = message;
                
                input.parentNode.insertBefore(errorDiv, input.nextSibling);
            }
        }
    }

    static validateImage(file) {
        return new Promise((resolve, reject) => {
            const img = new Image();
            img.onload = () => {
                resolve({
                    width: img.width,
                    height: img.height,
                    aspectRatio: img.width / img.height
                });
            };
            img.onerror = () => reject(new Error('图片加载失败'));
            img.src = URL.createObjectURL(file);
        });
    }

    static addFormValidation(form, rules, onSubmit) {
        form.addEventListener('submit', async (e) => {
            e.preventDefault();
            
            const formData = new FormData(form);
            const data = {};
            
            for (const [key, value] of formData.entries()) {
                data[key] = value;
            }

            const validation = this.validateForm(data, rules);
            
            if (validation.isValid) {
                await onSubmit(data);
            } else {
                this.showErrors(validation.errors, form);
            }
        });

        // 实时验证
        form.addEventListener('input', (e) => {
            const field = e.target.name;
            if (field && rules[field]) {
                const value = e.target.value;
                const fieldValidation = this.validateForm({ [field]: value }, { [field]: rules[field] });
                
                if (!fieldValidation.isValid) {
                    this.showErrors({ [field]: fieldValidation.errors[field] }, form);
                } else {
                    // 清除该字段的错误提示
                    const errorMessage = e.target.nextElementSibling;
                    if (errorMessage?.classList.contains('error-message')) {
                        errorMessage.remove();
                    }
                    e.target.classList.remove('error-input');
                }
            }
        });
    }
} 