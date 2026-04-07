// 鼠标点击爱心特效
(function() {
    'use strict';

    // 检查效果是否被启用
    if (!window.EffectToggle || !window.EffectToggle.isEnabled('clickEffects')) {
        // 如果效果被禁用，直接返回不初始化
        return;
    }

    // 爱心形状SVG
    function createHeartSVG() {
        return "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 32 32'%3E%3Cpath fill='%23ff6b81' d='M16 28C16 28 2 20.4 2 10.4C2 5.6 5.6 2 10.4 2C13.2 2 15.2 3.6 16 5C16.8 3.6 18.8 2 21.6 2C26.4 2 30 5.6 30 10.4C30 20.4 16 28 16 28Z'/%3E%3C/svg%3E";
    }

    // 创建飘落的爱心
    function createHeart(x, y) {
        const heart = document.createElement('div');
        heart.className = 'click-heart';
        heart.style.left = x + 'px';
        heart.style.top = y + 'px';

        // 随机大小
        const size = 12 + Math.random() * 16;
        heart.style.width = size + 'px';
        heart.style.height = size + 'px';

        // 随机颜色
        const colors = ['#ff6b81', '#ff4757', '#ff6b9d', '#c44569', '#e66767', '#f8a5c2', '#f78fb3'];
        const color = colors[Math.floor(Math.random() * colors.length)];
        heart.innerHTML = `<svg viewBox="0 0 32 32" width="${size}" height="${size}"><path fill="${color}" d="M16 28C16 28 2 20.4 2 10.4C2 5.6 5.6 2 10.4 2C13.2 2 15.2 3.6 16 5C16.8 3.6 18.8 2 21.6 2C26.4 2 30 5.6 30 10.4C30 20.4 16 28 16 28Z"/></svg>`;

        // 随机水平偏移
        const offsetX = (Math.random() - 0.5) * 80;
        heart.style.setProperty('--offset-x', offsetX + 'px');

        document.body.appendChild(heart);

        // 动画结束后移除
        heart.addEventListener('animationend', () => {
            heart.remove();
        });

        // 超时清理
        setTimeout(() => {
            if (heart.parentNode) heart.remove();
        }, 2000);
    }

    // 点击事件处理
    function handleClick(e) {
        // 每次点击创建多个爱心
        const count = 3 + Math.floor(Math.random() * 3); // 3-5个
        for (let i = 0; i < count; i++) {
            setTimeout(() => {
                createHeart(
                    e.clientX + (Math.random() - 0.5) * 20,
                    e.clientY + (Math.random() - 0.5) * 20
                );
            }, i * 50);
        }
    }

    // 初始化
    function initHeartEffect() {
        document.addEventListener('click', handleClick);
    }

    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', initHeartEffect);
    } else {
        initHeartEffect();
    }
})();