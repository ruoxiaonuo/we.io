document.addEventListener('mousemove', function(e) {
    const heart = document.createElement('div');
    heart.className = 'cursor-heart';
    heart.style.left = e.pageX + 'px';
    heart.style.top = e.pageY + 'px';
    
    // 随机颜色
    const colors = [
        '#ff6b6b',
        '#ff8787',
        '#ffa5a5',
        '#ff4f4f',
        '#ff3434'
    ];
    heart.style.color = colors[Math.floor(Math.random() * colors.length)];
    
    document.body.appendChild(heart);
    
    // 添加动画结束监听器
    heart.addEventListener('animationend', function() {
        heart.remove();
    });
}); 