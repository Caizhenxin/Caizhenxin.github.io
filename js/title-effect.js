// 页面离开/返回时标题动态变化效果
(function() {
    'use strict';

    // 存储原始标题
    const originalTitle = document.title;
    
    // 定义离开时的标题和返回时的标题
    const leaveTitle = "你别走呀Σσ(・Д・；)!!!";
    const returnTitle = "我知道你还会回来٩(๑>◡<๑)۶ ";
    
    // 处理页面可见性变化
    function handleVisibilityChange() {
        if (document.hidden) {
            // 页面被隐藏（用户切换到其他标签页或最小化窗口）
            document.title = leaveTitle;
        } else {
            // 页面重新可见
            document.title = returnTitle;
            // 短暂显示返回标题后恢复原始标题
            setTimeout(() => {
                document.title = originalTitle;
            }, 2000); // 2秒后恢复原始标题
        }
    }

    // 监听页面可见性变化
    function initTitleEffect() {
        // 使用Page Visibility API
        if ('hidden' in document) {
            document.addEventListener('visibilitychange', handleVisibilityChange);
        } else if ('webkitHidden' in document) {
            document.addEventListener('webkitvisibilitychange', handleVisibilityChange);
        } else if ('mozHidden' in document) {
            document.addEventListener('mozvisibilitychange', handleVisibilityChange);
        } else if ('msHidden' in document) {
            document.addEventListener('msvisibilitychange', handleVisibilityChange);
        }
        
        // 另外，也可以使用pagehide/pageshow事件作为备用
        window.addEventListener('pagehide', () => {
            document.title = leaveTitle;
        });
        
        window.addEventListener('pageshow', () => {
            document.title = returnTitle;
            setTimeout(() => {
                document.title = originalTitle;
            }, 2000);
        });
    }

    // 初始化
    function init() {
        if (document.readyState === 'loading') {
            document.addEventListener('DOMContentLoaded', initTitleEffect);
        } else {
            initTitleEffect();
        }
    }

    // 暴露初始化函数
    window.initTitleEffect = initTitleEffect;
    
    // 自动初始化
    init();
})();