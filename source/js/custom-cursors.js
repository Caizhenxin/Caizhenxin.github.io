// 自定义鼠标光标控制
(function() {
    'use strict';

    // 检查效果是否被启用
    if (!window.EffectToggle || !window.EffectToggle.isEnabled('customCursors')) {
        // 如果效果被禁用，直接返回不初始化
        return;
    }

    // 为body添加类以启用自定义光标CSS
    document.body.classList.add('custom-cursors-enabled');
})();