// 效果开关按钮UI
(function() {
    'use strict';

    // 创建开关按钮HTML
    function createToggleButton() {
        const button = document.createElement('button');
        button.id = 'effect-toggle-button';
        button.className = 'effect-toggle-btn';
        button.setAttribute('aria-label', '切换视觉效果');
        button.setAttribute('aria-pressed', 'false');
        button.innerHTML = `
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm0 18c-4.41 0-8-3.59-8-8s3.59-8 8-8 8 3.59 8 8-3.59 8-8 8z" stroke="currentColor" stroke-width="2"/>
                <path d="M12 8c2.21 0 4 1.79 4 4s-1.79 4-4 4-4-1.79-4-4 1.79-4 4-4zm0 6c-1.1 0-2-.9-2-2s.9-2 2-2 2 .9 2 2-.9 2-2 2z" fill="currentColor"/>
            </svg>
            <span class="toggle-label">效果</span>
        `;
        return button;
    }

    // 更新按钮状态
    function updateToggleButton(isEnabled) {
        const button = document.getElementById('effect-toggle-button');
        if (button) {
            button.setAttribute('aria-pressed', isEnabled);
            if (isEnabled) {
                button.classList.add('active');
                button.querySelector('.toggle-label').textContent = '效果: 开';
            } else {
                button.classList.remove('active');
                button.querySelector('.toggle-label').textContent = '效果: 关';
            }
        }
    }

    // 处理按钮点击
    function handleToggleClick() {
        const button = document.getElementById('effect-toggle-button');
        if (!button) return;

        const isCurrentlyEnabled = button.getAttribute('aria-pressed') === 'true';
        const newState = !isCurrentlyEnabled;
        
        // 更新按钮UI
        updateToggleButton(newState);
        
        // 保存偏好
        if (window.EffectToggle) {
            // 这里我们切换所有效果的总开关
            // 实际上可能需要更细粒度的控制，但作为演示，我们切换主要效果
            const settings = window.EffectToggle.getAll();
            const updatedSettings = {
                ...settings,
                snow: newState,
                mouseTrail: newState,
                clickEffects: newState,
                customCursors: newState,
                titleEffect: newState
            };
            window.EffectToggle.saveSettings(updatedSettings);
            
            // 触发页面重新加载以应用新设置
            // 或者我们可以实现更复杂的运行时启用/禁用逻辑
            // 为了简单起见，我们重新加载页面
            setTimeout(() => {
                location.reload();
            }, 100);
        }
    }

    // 初始化
    function init() {
        // 创建按钮并添加到页面
        const toggleButton = createToggleButton();
        document.body.appendChild(toggleButton);
        
        // 设置初始状态
        const isEnabled = window.EffectToggle ? 
            window.EffectToggle.isEnabled('snow') : true; // 默认检查雪花效果作为代表
        updateToggleButton(isEnabled);
        
        // 添加点击事件监听器
        toggleButton.addEventListener('click', handleToggleClick);
        
        // 添加样式
        const style = document.createElement('style');
        style.textContent = `
            .effect-toggle-btn {
                position: fixed;
                bottom: 20px;
                right: 20px;
                width: 50px;
                height: 50px;
                border-radius: 50%;
                border: 2px solid rgba(0,0,0,0.1);
                background-color: rgba(255,255,255,0.9);
                backdrop-filter: blur(10px);
                display: flex;
                align-items: center;
                justify-content: center;
                cursor: pointer;
                z-index: 10000;
                transition: all 0.3s ease;
                box-shadow: 0 4px 12px rgba(0,0,0,0.15);
            }
            
            .effect-toggle-btn:hover {
                background-color: rgba(255,255,255,1);
                transform: scale(1.05);
                box-shadow: 0 6px 16px rgba(0,0,0,0.2);
            }
            
            .effect-toggle-btn.active {
                border-color: #ff6b6b;
                background-color: #fff0f0;
            }
            
            .effect-toggle-btn svg {
                width: 24px;
                height: 24px;
                transition: transform 0.3s ease;
            }
            
            .effect-toggle-btn.active svg {
                transform: rotate(45deg);
            }
            
            .toggle-label {
                position: absolute;
                bottom: -20px;
                left: 50%;
                transform: translateX(-50%);
                font-size: 12px;
                font-weight: 500;
                color: #333;
                white-space: nowrap;
            }
            
            @media (max-width: 480px) {
                .effect-toggle-btn {
                    bottom: 15px;
                    right: 15px;
                    width: 45px;
                    height: 45px;
                }
                
                .toggle-label {
                    bottom: -18px;
                    font-size: 10px;
                }
            }
        `;
        document.head.appendChild(style);
    }

    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', init);
    } else {
        init();
    }
})();