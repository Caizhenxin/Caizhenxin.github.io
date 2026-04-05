// 语言切换功能
(function() {
  'use strict';

  // 获取当前语言
  function getCurrentLang() {
    return localStorage.getItem('site-lang') || 'zh-CN';
  }

  // 切换语言
  function switchLang(lang) {
    localStorage.setItem('site-lang', lang);
    window.location.reload();
  }

  // 在导航栏添加语言切换按钮
  function addLangSwitcher() {
    const navbar = document.querySelector('.navbar .collapse');
    if (!navbar) return;

    const currentLang = getCurrentLang();
    const targetLang = currentLang === 'zh-CN' ? 'en' : 'zh-CN';
    const langText = currentLang === 'zh-CN' ? 'EN' : '中文';

    const langItem = document.createElement('li');
    langItem.className = 'nav-item';
    langItem.innerHTML = `
      <a class="nav-link lang-switch-btn" href="javascript:void(0)" title="切换语言 / Switch Language">
        <i class="iconfont icon-font"></i>
        <span class="d-lg-none">${langText}</span>
      </a>
    `;

    langItem.querySelector('a').addEventListener('click', function(e) {
      e.preventDefault();
      switchLang(targetLang);
    });

    navbar.appendChild(langItem);
  }

  // 应用语言设置
  function applyLangSetting() {
    const lang = getCurrentLang();
    document.documentElement.setAttribute('lang', lang);
  }

  // 初始化
  document.addEventListener('DOMContentLoaded', function() {
    applyLangSetting();
    addLangSwitcher();
  });
})();
