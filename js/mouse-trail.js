// 鼠标轨迹特效
(function() {
    'use strict';

    // 加载mouse-animations库
    function loadMouseAnimations() {
        return new Promise((resolve, reject) => {
            // 检查是否已经加载
            if (window.mouseAnimationsLoaded) {
                resolve();
                return;
            }
            
            const script = document.createElement('script');
            script.src = 'https://cdn.jsdelivr.net/npm/mouse-animations/+esm';
            script.type = 'module';
            
            script.onload = () => {
                window.mouseAnimationsLoaded = true;
                resolve();
            };
            
            script.onerror = () => {
                reject(new Error('Failed to load mouse-animations library'));
            };
            
            document.head.appendChild(script);
        });
    }

    // 初始化鼠标轨迹效果
    function initMouseTrail() {
        loadMouseAnimations().then(() => {
            // 使用mouse-animations库的Trail效果
            import('https://cdn.jsdelivr.net/npm/mouse-animations/+esm').then(({ Trail }) => {
                const trail = new Trail({
                    color: '#ff6b6b', // 露珠粉色
                    size: 4,          // 点的最大半径
                    length: 15,       // 轨迹点数量
                    decay: 0.05,      // 透明度衰减
                    blur: 1           // 轻微模糊
                });
                
                // 存储实例以便后续可能的销毁
                window.mouseTrailInstance = trail;
                
                // 监听主题切换以适应深色/浅色模式
                if (window.matchMedia) {
                    const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)');
                    const handleThemeChange = (e) => {
                        // 根据主题调整颜色
                        if (e.matches) {
                            // 深色模式 - 使用更亮的颜色
                            trail.options.color = '#ff9e9e';
                        } else {
                            // 浅色模式 - 使用标准颜色
                            trail.options.color = '#ff6b6b';
                        }
                    };
                    
                    mediaQuery.addEventListener('change', handleThemeChange);
                    // 初始化时也设置一次
                    handleThemeChange(mediaQuery);
                }
            }).catch(error => {
                console.error('Failed to initialize mouse trail effect:', error);
            });
        }).catch(error => {
            console.error('Failed to load mouse animations library:', error);
        });
    }

    // 初始化
    function init() {
        if (document.readyState === 'loading') {
            document.addEventListener('DOMContentLoaded', initMouseTrail);
        } else {
            initMouseTrail();
        }
    }

    // 暴露初始化函数
    window.initMouseTrail = initMouseTrail;
    
    // 自动初始化
    init();
})();