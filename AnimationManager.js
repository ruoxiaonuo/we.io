class AnimationManager {
    static DURATIONS = {
        SHORT: 200,
        MEDIUM: 300,
        LONG: 500
    };

    static EASINGS = {
        LINEAR: 'linear',
        EASE: 'ease',
        EASE_IN: 'ease-in',
        EASE_OUT: 'ease-out',
        EASE_IN_OUT: 'ease-in-out',
        BOUNCE: 'cubic-bezier(0.68, -0.55, 0.265, 1.55)'
    };

    // 淡入动画
    static fadeIn(element, duration = this.DURATIONS.MEDIUM) {
        element.style.opacity = '0';
        element.style.display = 'block';
        element.style.transition = `opacity ${duration}ms ${this.EASINGS.EASE}`;

        requestAnimationFrame(() => {
            element.style.opacity = '1';
        });

        return new Promise(resolve => {
            setTimeout(resolve, duration);
        });
    }

    // 淡出动画
    static fadeOut(element, duration = this.DURATIONS.MEDIUM) {
        element.style.opacity = '1';
        element.style.transition = `opacity ${duration}ms ${this.EASINGS.EASE}`;

        requestAnimationFrame(() => {
            element.style.opacity = '0';
        });

        return new Promise(resolve => {
            setTimeout(() => {
                element.style.display = 'none';
                resolve();
            }, duration);
        });
    }

    // 滑入动画
    static slideIn(element, direction = 'right', duration = this.DURATIONS.MEDIUM) {
        const directions = {
            right: 'translateX(100%)',
            left: 'translateX(-100%)',
            up: 'translateY(-100%)',
            down: 'translateY(100%)'
        };

        element.style.transform = directions[direction];
        element.style.display = 'block';
        element.style.transition = `transform ${duration}ms ${this.EASINGS.EASE_OUT}`;

        requestAnimationFrame(() => {
            element.style.transform = 'translate(0)';
        });

        return new Promise(resolve => {
            setTimeout(resolve, duration);
        });
    }

    // 滑出动画
    static slideOut(element, direction = 'right', duration = this.DURATIONS.MEDIUM) {
        const directions = {
            right: 'translateX(100%)',
            left: 'translateX(-100%)',
            up: 'translateY(-100%)',
            down: 'translateY(100%)'
        };

        element.style.transform = 'translate(0)';
        element.style.transition = `transform ${duration}ms ${this.EASINGS.EASE_IN}`;

        requestAnimationFrame(() => {
            element.style.transform = directions[direction];
        });

        return new Promise(resolve => {
            setTimeout(() => {
                element.style.display = 'none';
                resolve();
            }, duration);
        });
    }

    // 缩放动画
    static scale(element, startScale = 0, endScale = 1, duration = this.DURATIONS.MEDIUM) {
        element.style.transform = `scale(${startScale})`;
        element.style.display = 'block';
        element.style.transition = `transform ${duration}ms ${this.EASINGS.BOUNCE}`;

        requestAnimationFrame(() => {
            element.style.transform = `scale(${endScale})`;
        });

        return new Promise(resolve => {
            setTimeout(resolve, duration);
        });
    }

    // 抖动动画
    static shake(element, intensity = 5, duration = this.DURATIONS.SHORT) {
        const originalPosition = element.style.transform || 'translateX(0)';
        const keyframes = [
            { transform: originalPosition },
            { transform: `translateX(-${intensity}px)` },
            { transform: `translateX(${intensity}px)` },
            { transform: `translateX(-${intensity}px)` },
            { transform: `translateX(${intensity}px)` },
            { transform: originalPosition }
        ];

        return element.animate(keyframes, {
            duration,
            easing: this.EASINGS.EASE_IN_OUT
        }).finished;
    }

    // 脉冲动画
    static pulse(element, scale = 1.1, duration = this.DURATIONS.MEDIUM) {
        const keyframes = [
            { transform: 'scale(1)' },
            { transform: `scale(${scale})` },
            { transform: 'scale(1)' }
        ];

        return element.animate(keyframes, {
            duration,
            easing: this.EASINGS.EASE_IN_OUT
        }).finished;
    }

    // 添加波纹效果
    static addRipple(event, color = 'rgba(255, 255, 255, 0.3)') {
        const button = event.currentTarget;
        const circle = document.createElement('span');
        const diameter = Math.max(button.clientWidth, button.clientHeight);
        const radius = diameter / 2;

        circle.style.width = circle.style.height = `${diameter}px`;
        circle.style.left = `${event.clientX - button.offsetLeft - radius}px`;
        circle.style.top = `${event.clientY - button.offsetTop - radius}px`;
        circle.classList.add('ripple');
        circle.style.backgroundColor = color;

        const ripple = button.getElementsByClassName('ripple')[0];
        if (ripple) {
            ripple.remove();
        }

        button.appendChild(circle);

        return new Promise(resolve => {
            setTimeout(() => {
                circle.remove();
                resolve();
            }, 600);
        });
    }
} 