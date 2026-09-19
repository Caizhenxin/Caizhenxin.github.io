// 语言切换功能 - 导航到对应语言路径
//
// ---------------------------------------------------------------------------
// 本文件于 2026-09 做过四处修正（都属于原有 bug，不是新功能）：
//
//  1) getCurrentLang() 只看 URL 路径，不再读 localStorage。
//     原问题：只要 localStorage 里存过 'en'，在**中文页面**上按钮就会显示
//     「中文」，而点下去执行的是 window.location.href = 当前同一个地址，
//     表现为「切换按钮点了没反应」。
//
//  2) 语言切换按钮的图标 icon-font → icon-switch-fill。
//     原问题：iconfont 里**没有** icon-font 这个类名（两套字体都没有），
//     没有类名就没有 content 值，那个小图标一直是空白的。
//     icon-switch-fill 是真实存在的类名。
//
//  3) 跳转前先探测目标页是否存在，不存在就退回到英文首页。
//     原问题：/archives/、/tags/ 这类页面 **没有** /en/ 版本
//     （hexo-generator-i18n 只为 page / post / 分类 / 首页生成语言副本，
//      归档页和标签页不生成），因此在归档页点 EN 会跳到 404。
//
//  4) 新增 I18N_LINKS：英文模式下把导航栏里「确实有英文版」的链接
//     指到 /en/ 前缀，否则在 /en/research/ 上点「研究」会跳回中文页。
//     只列已确认存在 /en/ 副本的页面。
// ---------------------------------------------------------------------------
(function() {
  'use strict';

  // 英文模式下需要保持语言前缀的站内路径。
  // ⚠️ 只放「确有 /en/ 副本」的页面：/about/、/research/ 已确认存在。
  //    不要加 /archives/、/tags/、/categories/、/links/，它们没有 /en/ 版本，
  //    加了会让英文模式下的导航出现 404。
  var I18N_LINKS = ['/research/', '/about/'];

  // 当前语言：只根据 URL 判断，不看 localStorage（见文件头说明 1）
  function getCurrentLang() {
    var p = window.location.pathname;
    if (p === '/en' || p.indexOf('/en/') === 0) return 'en';
    return 'zh-CN';
  }

  // 计算目标语言下的当前页地址
  function targetUrl(lang) {
    var p = window.location.pathname;
    if (lang === 'en') {
      return (p === '/en' || p.indexOf('/en/') === 0) ? p : '/en' + p;
    }
    return p.replace(/^\/en(\/|$)/, '/') || '/';
  }

  // 跳转；若目标页不存在则退回到 fallback（见文件头说明 3）
  function navigate(url, fallback) {
    var done = false;
    function go(u) {
      if (done) return;
      done = true;
      window.location.href = u;
    }
    if (typeof fetch !== 'function') { go(url); return; }
    var timer = setTimeout(function() { go(fallback); }, 1500);
    try {
      fetch(url, { method: 'HEAD' })
        .then(function(res) {
          clearTimeout(timer);
          go(res && res.ok ? url : fallback);
        })
        .catch(function() {
          clearTimeout(timer);
          go(url);
        });
    } catch (e) {
      clearTimeout(timer);
      go(url);
    }
  }

  // 英文模式下，把导航栏里 I18N_LINKS 里的链接加上 /en/ 前缀
  function localizeNavLinks() {
    if (getCurrentLang() !== 'en') return;

    var brand = document.querySelector('.navbar-brand');
    if (brand) brand.setAttribute('href', '/en/');

    var links = document.querySelectorAll(
      '.navbar-collapse a[href], #mobile-grid-menu a[href]'
    );
    Array.prototype.forEach.call(links, function(a) {
      var href = a.getAttribute('href');
      if (href && I18N_LINKS.indexOf(href) !== -1) {
        a.setAttribute('href', '/en' + href);
      }
    });
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
          '<i class="iconfont icon-switch-fill"></i> ' + langText + '</a>';

        langItem.querySelector('a').addEventListener('click', function(e) {
          e.preventDefault();
          // 英文版不存在时退回英文首页；切回中文时首页即 /，一定存在
          navigate(targetUrl(targetLang), targetLang === 'en' ? '/en/' : '/');
        });

        navbar.appendChild(langItem);
        localizeNavLinks();
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
