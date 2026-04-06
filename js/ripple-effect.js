// 鼠标点击涟漪特效
(function() {
    'use strict';

    // 创建涟漪效果
    function createRipple(event) {
        const button = event.currentTarget;

        // 创建涟漪元素
        const ripple = document.createElement('span');
        ripple.className = 'ripple';
        
        // 获取点击坐标相对于按钮的位置
        const rect = button.getBoundingClientRect();
        const x = event.clientX - rect.left;
        const y = event.clientY - rect.top;
        
        // 设置涟漪位置和大小
        ripple.style.left = `${x}px`;
        ripple.style.top = `${y}px`;
        
        // 添加到按钮
        button.appendChild(ripple);
        
        // 触发CSS动画
        // 使用requestAnimationFrame确保DOM已更新
        requestAnimationFrame(() => {
            ripple.classList.add('active');
        });
        
        // 动画结束后移除元素
        ripple.addEventListener('animationend', () => {
            ripple.remove();
        });
    }

    // 为所有按钮和可点击元素添加涟漪效果
    function addRippleEffect() {
        // 选择所有可点击元素
        const clickableElements = document.querySelectorAll('a, button, [role="button"], [onclick], input[type="button"], input[type="submit"], input[type="reset"], label, select, summary');
        
        clickableElements.forEach(element => {
            // 防止重复绑定
            if (!element.classList.contains('ripple-effect-attached')) {
                element.classList.add('ripple-effect-attached');
                element.addEventListener('click', createRipple);
            }
        });
    }

    // 初始化
    function initRippleEffect() {
        if (document.readyState === 'loading') {
            document.addEventListener('DOMContentLoaded', addRippleEffect);
        } else {
            addRippleEffect();
        }
        
        // 同时监听DOM变化以处理动态添加的元素
        if ('MutationObserver' in window) {
            const observer = new MutationObserver(function(mutations) {
                mutations.forEach(function(mutation) {
                    if (mutation.addedNodes.length) {
                        // 检查新添加的节点是否需要添加涟漪效果
                        mutation.addedNodes.forEach(function(node) {
                            if (node.nodeType === 1) { // 元素节点
                                // 检查节点本身
                                if (node.matches && node.matches('a, button, [role="button"], [onclick], input[type="button"], input[type="submit"], input[type="reset"], label, select, summary')) {
                                    if (!node.classList.contains('ripple-effect-attached')) {
                                        node.classList.add('ripple-effect-attached');
                                        node.addEventListener('click', createRipple);
                                    }
                                }
                                // 检查节点的子元素
                                const clickableChildren = node.querySelectorAll('a, button, [role="button"], [onclick], input[type="button"], input[type="submit"], input[type="reset"], label, select, summary');
                                clickableChildren.forEach(child => {
                                    if (!child.classList.contains('ripple-effect-attached')) {
                                        child.classList.add('ripple-effect-attached');
                                        child.addEventListener('click', createRipple);
                                    }
                                });
                            }
                        });
                    }
                });
            });
            
            observer.observe(document.body, {
                childList: true,
                subtree: true
            });
        }
    }

    // 暴露初始化函数
    window.initRippleEffect = initRippleEffect;

    // 自动初始化
    initRippleEffect();
})();