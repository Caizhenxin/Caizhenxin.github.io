// 效果开关管理系统
(function() {
    'use strict';

    // 默认设置：所有效果开启
    const defaultSettings = {
        snow: true,
        mouseTrail: true,
        clickEffects: true, // 点击爱心特效
        customCursors: true, // 自定义鼠标光标
        titleEffect: true    // 页面标题变化效果
    };

    // 从localStorage加载设置，如果不存在则使用默认值
    function loadSettings() {
        const saved = localStorage.getItem('blogEffectSettings');
        if (saved) {
            try {
                return { ...defaultSettings, ...JSON.parse(saved) };
            } catch (e) {
                console.warn('Failed to parse effect settings from localStorage, using defaults');
                return { ...defaultSettings };
            }
        }
        return { ...defaultSettings };
    }

    // 保存设置到localStorage
    function saveSettings(settings) {
        try {
            localStorage.setItem('blogEffectSettings', JSON.stringify(settings));
        } catch (e) {
            console.error('Failed to save effect settings to localStorage:', e);
        }
    }

    // 获取当前设置
    function getSettings() {
        if (!window.blogEffectSettings) {
            window.blogEffectSettings = loadSettings();
        }
        return window.blogEffectSettings;
    }

    // 更新特定设置
    function updateSetting(key, value) {
        const settings = getSettings();
        settings[key] = value;
        saveSettings(settings);
        return settings;
    }

    // 检查特定效果是否启用
    function isEffectEnabled(effectName) {
        const settings = getSettings();
        return settings[effectName] !== undefined ? settings[effectName] : defaultSettings[effectName];
    }

    // 初始化
    function init() {
        // 确保设置对象存在
        if (!window.blogEffectSettings) {
            window.blogEffectSettings = loadSettings();
        }
        
        // 暴露函数供其他脚本使用
        window.EffectToggle = {
            isEnabled: isEffectEnabled,
            update: updateSetting,
            getAll: getSettings,
            resetToDefaults: function() {
                saveSettings({...defaultSettings});
                window.blogEffectSettings = {...defaultSettings};
                return window.blogEffectSettings;
            }
        };
    }

    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', init);
    } else {
        init();
    }
})();