// 语言切换功能 - 导航到对应语言路径
(function() {
  'use strict';

  // 获取当前语言（从 URL 或 localStorage）
  function getCurrentLang() {
    const path = window.location.pathname;
    if (path.startsWith('/en/') || path === '/en') return 'en';
    if (path.startsWith('/zh-CN/') || path === '/zh-CN') return 'zh-CN';
    return localStorage.getItem('site-lang') || 'zh-CN';
  }

  // 切换语言 - 导航到对应路径
  function switchLang(lang) {
    localStorage.setItem('site-lang', lang);
    const path = window.location.pathname;

    if (lang === 'en') {
      // 切换到英文
      if (path.startsWith('/zh-CN/')) {
        window.location.href = path.replace('/zh-CN/', '/en/');
      } else if (path === '/zh-CN') {
        window.location.href = '/en';
      } else {
        window.location.href = '/en' + path;
      }
    } else {
      // 切换到中文
      if (path.startsWith('/en/')) {
        window.location.href = path.replace('/en/', '/');
      } else if (path === '/en') {
        window.location.href = '/';
      } else {
        window.location.href = path;
      }
    }
  }

  // 在导航栏添加语言切换按钮
  function addLangSwitcher() {
    // 等待导航栏加载完成
    var checkNavbar = setInterval(function() {
      var navbar = document.querySelector('.navbar-collapse') || document.querySelector('.navbar .collapse');
      if (navbar) {
        clearInterval(checkNavbar);

        var currentLang = getCurrentLang();
        var targetLang = currentLang === 'zh-CN' ? 'en' : 'zh-CN';
        var langText = currentLang === 'zh-CN' ? 'EN' : '中文';

        var langItem = document.createElement('li');
        langItem.className = 'nav-item';
        langItem.innerHTML = '<a class="nav-link lang-switch-btn" href="javascript:void(0)" title="Switch Language / 切换语言">' +
          '<i class="iconfont icon-font"></i> ' + langText + '</a>';

        langItem.querySelector('a').addEventListener('click', function(e) {
          e.preventDefault();
          switchLang(targetLang);
        });

        navbar.appendChild(langItem);
      }
    }, 100);

    // 超时停止检查
    setTimeout(function() { clearInterval(checkNavbar); }, 5000);
  }

  // 初始化
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', addLangSwitcher);
  } else {
    addLangSwitcher();
  }
})();
