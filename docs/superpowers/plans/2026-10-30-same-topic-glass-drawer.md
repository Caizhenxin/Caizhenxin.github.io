# 同主题文章聚合「磨砂抽屉」实现计划

> **For agentic workers:** 按任务顺序执行，步骤用 `- [ ]` 勾选。验证方式：`npx hexo generate` + 本地 `npx hexo server -p 4001` 人工核验（该站点无单元测试框架，故以构建通过 + 页面行为为准）。

**Goal:** 首页将同 `series` 且 ≥2 篇的文章收拢为一张磨砂「专题卡」，悬停/聚焦展开抽屉列出全部条目。

**Architecture:** 在 `index.ejs` 内按 `series` 分组，跳过已渲染的组员；新增 `_partials/topic-card.ejs` 承载卡片与抽屉结构；样式与交互分别落在 `source/css/topic-card.css` 与 `source/js/topic-drawer.js`，通过 `custom_css` / `custom_js` 挂载，不侵入 Fluid 核心样式。

**Tech Stack:** Hexo 6 + EJS 模板 + 原生 CSS/JS（无框架）。

---

## File Structure

| 类型 | 路径 | 职责 |
|------|------|------|
| Create | `themes/fluid/layout/_partials/topic-card.ejs` | 专题卡 + 抽屉 DOM |
| Modify | `themes/fluid/layout/index.ejs` | 分组、跳过已渲染、选择渲染分支 |
| Create | `source/css/topic-card.css` | 磨砂 / 光晕 / 动效 / 暗色 / 响应式 |
| Create | `source/js/topic-drawer.js` | hover/focus/click/Esc 展开收起 |
| Modify | `themes/fluid/_config.yml` | 注册 custom css/js |
| Modify | `source/_posts/the-night-i-will-remember.md` 等三篇 | 加 `series: 夜谈` |

---

### Task 1：为「夜谈」三篇加 series 字段

**Files:**
- Modify: `source/_posts/the-night-i-will-remember.md`（第 11 行 `---` 前）
- Modify: `source/_posts/a-being-without-night.md`
- Modify: `source/_posts/the-third-version.md`

- [ ] **Step 1**：在三篇 front-matter 的 `categories` 块后各加一行 `series: 夜谈`。

```yaml
series: 夜谈
```

- [ ] **Step 2**：`npx hexo generate` 确认无解析错误。

---

### Task 2：新增 `topic-card.ejs`

**Files:** Create `themes/fluid/layout/_partials/topic-card.ejs`

- [ ] **Step 1**：写入以下完整内容。

```ejs
<%
var startPost = locals.startPost;
var posts = locals.posts;
var count = locals.count;
var topicName = locals.topicName;
var drawerId = locals.drawerId;
var startUrl = url_for(startPost.path);
var startExcerpt = startPost.description || startPost.excerpt || (theme.index.auto_excerpt.enable && !startPost.encrypt && startPost.content);
%>
<div class="row mx-auto index-card topic-card" role="button" tabindex="0" aria-expanded="false" aria-controls="<%= drawerId %>">
  <article class="col-12 mx-auto index-info topic-card__summary">
    <h2 class="index-header topic-card__title">
      <a href="<%= startUrl %>" target="<%- theme.index.post_url_target %>"><%= topicName %></a>
      <span class="topic-card__count">共 <%= count %> 篇</span>
    </h2>
    <a class="index-excerpt index-excerpt__noimg" href="<%= startUrl %>" target="<%- theme.index.post_url_target %>">
      <div><%- strip_html(startExcerpt).substring(0, 180).trim().replace(/\n/g, ' ') %></div>
    </a>
    <div class="index-btm post-metas">
      <div class="post-meta mr-3">
        <i class="iconfont icon-date"></i>
        <time datetime="<%= full_date(posts[0].date, 'YYYY-MM-DD HH:mm') %>"><%- date(posts[0].date, config.date_format) %></time>
      </div>
      <div class="post-meta">
        <i class="iconfont icon-tags"></i>
        <span class="topic-card__hint">悬停展开全部篇目</span>
      </div>
    </div>
  </article>
  <div class="topic-drawer" id="<%= drawerId %>" aria-hidden="true">
    <ul class="topic-drawer__list">
      <% posts.forEach(function (item, i) { %>
        <li class="topic-drawer__item">
          <a href="<%= url_for(item.path) %>" target="<%- theme.index.post_url_target %>">
            <span class="topic-drawer__index"><%= i + 1 < 10 ? '0' + (i + 1) : (i + 1) %></span>
            <span class="topic-drawer__name"><%= item.title %></span>
            <span class="topic-drawer__date"><%- date(item.date, 'MM-DD') %></span>
          </a>
        </li>
      <% }) %>
    </ul>
  </div>
</div>
```

---

### Task 3：改写 `index.ejs` 分组渲染

**Files:** Modify `themes/fluid/layout/index.ejs`

- [ ] **Step 1**：用分组逻辑替换原 `page.posts.each` 循环，普通卡片分支保留原标记。

```ejs
<%
if (theme.index.slogan.enable) {
  page.subtitle = theme.index.slogan.text || config.subtitle || ''
}
page.banner_img = theme.index.banner_img
page.banner_img_height = theme.index.banner_img_height
page.banner_mask_alpha = theme.index.banner_mask_alpha
%>

<h1 style="display: none"><%= config.title %></h1>
<%
var postsArr = page.posts.toArray();
var seriesMap = {};
postsArr.forEach(function (post) {
  var s = post.series;
  if (!s) return;
  var key = String(s);
  if (!seriesMap[key]) seriesMap[key] = [];
  seriesMap[key].push(post);
});
var renderedSeries = {};
var topicSeq = 0;
var seriesThreshold = 2;
%>
<% postsArr.forEach(function (post) { %>
  <%
  var seriesKey = post.series ? String(post.series) : null;
  var group = seriesKey ? seriesMap[seriesKey] : null;
  var isTopic = seriesKey && group && group.length >= seriesThreshold;
  if (isTopic && renderedSeries[seriesKey]) return;
  if (isTopic) { renderedSeries[seriesKey] = true; topicSeq++; }
  %>
  <% if (isTopic) { %>
    <%
    var ordered = group.slice().sort(function (a, b) { return a.date - b.date; });
    %>
    <%- partial('_partials/topic-card', {
      topicName: seriesKey,
      posts: ordered,
      startPost: ordered[0],
      count: group.length,
      drawerId: 'topic-drawer-' + topicSeq
    }) %>
  <% } else { %>
    <div class="row mx-auto index-card">
      <% var post_url = url_for(post.path), index_img = post.index_img || theme.post.default_index_img %>
      <% if (index_img) { %>
        <div class="col-12 col-md-4 m-auto index-img">
          <a href="<%= post_url %>" target="<%- theme.index.post_url_target %>">
            <img src="<%= url_for(index_img) %>" alt="<%= post.title %>">
          </a>
        </div>
      <% } %>
      <article class="col-12 col-md-<%= index_img ? '8' : '12' %> mx-auto index-info">
        <h2 class="index-header">
          <% if (theme.index.post_sticky && theme.index.post_sticky.enable && post.sticky > 0) { %>
            <i class="index-pin <%= theme.index.post_sticky && theme.index.post_sticky.icon %>" title="Pin on top"></i>
          <% } %>
          <a href="<%= post_url %>" target="<%- theme.index.post_url_target %>">
            <%= post.title %>
          </a>
        </h2>
        <% var excerpt = post.description || post.excerpt || (theme.index.auto_excerpt.enable && !post.encrypt && post.content) %>
        <a class="index-excerpt <%= index_img ? '' : 'index-excerpt__noimg' %>" href="<%= post_url %>" target="<%- theme.index.post_url_target %>">
          <div>
            <%- strip_html(excerpt).substring(0, 200).trim().replace(/\n/g, ' ') %>
          </div>
        </a>
        <div class="index-btm post-metas">
          <% if (theme.index.post_meta.date) { %>
            <div class="post-meta mr-3">
              <i class="iconfont icon-date"></i>
              <time datetime="<%= full_date(post.date, 'YYYY-MM-DD HH:mm') %>" pubdate>
                <%- date(post.date, config.date_format) %>
              </time>
            </div>
          <% } %>
          <% if (theme.index.post_meta.category && post.categories.length > 0) { %>
            <div class="post-meta mr-3 d-flex align-items-center">
              <i class="iconfont icon-category"></i>
              <%- partial('_partials/category-chains', { categories: post.categories, limit: 1 }) %>
            </div>
          <% } %>
          <% if (theme.index.post_meta.tag && post.tags.length > 0) { %>
            <div class="post-meta">
              <i class="iconfont icon-tags"></i>
              <% post.tags.each(function(tag){ %>
                <a href="<%= url_for(tag.path) %>">#<%- tag.name %></a>
              <% }) %>
            </div>
          <% } %>
        </div>
      </article>
    </div>
  <% } %>
<% }) %>

<%- partial('_partials/paginator') %>
```

---

### Task 4：新增 `topic-card.css`

**Files:** Create `source/css/topic-card.css`

- [ ] **Step 1**：写入完整样式（磨砂、光晕、stagger、暗色、响应式、减动效）。

```css
.topic-card { position: relative; }

.topic-card__title { display: flex; align-items: baseline; gap: .5rem; flex-wrap: wrap; }
.topic-card__count {
  font-size: .8rem; font-weight: normal; color: var(--sec-text-color);
  border: 1px solid var(--line-color); border-radius: 999px; padding: .05rem .5rem;
}
.topic-card__hint { color: var(--sec-text-color); }

.topic-card::before {
  content: ""; position: absolute; inset: -8px; z-index: 0; border-radius: 1rem;
  background: radial-gradient(130% 90% at 50% 0%, rgba(86, 132, 255, .16), rgba(86, 132, 255, 0) 70%);
  opacity: 0; pointer-events: none; filter: blur(6px); transition: opacity .3s ease;
}
.topic-card.is-open::before { opacity: 1; }
.topic-card__summary { position: relative; z-index: 1; }

.topic-drawer {
  position: absolute; left: 1rem; right: 1rem; top: 100%; margin-top: .35rem; z-index: 20;
  padding: .5rem; border-radius: .75rem;
  background: rgba(255, 255, 255, .72);
  -webkit-backdrop-filter: blur(12px) saturate(140%); backdrop-filter: blur(12px) saturate(140%);
  border: 1px solid rgba(0, 0, 0, .06);
  box-shadow: 0 12px 32px rgba(0, 0, 0, .10), 0 2px 8px rgba(0, 0, 0, .06);
  opacity: 0; visibility: hidden; transform: translateY(8px) scale(.98); transform-origin: top center;
  pointer-events: none;
  transition: opacity .26s ease, transform .26s cubic-bezier(.22, .61, .36, 1), visibility .26s;
}
.topic-card.is-open .topic-drawer {
  opacity: 1; visibility: visible; transform: translateY(0) scale(1); pointer-events: auto;
}

.topic-drawer__list { list-style: none; margin: 0; padding: .1rem; }
.topic-drawer__item { opacity: 0; transform: translateY(6px); transition: opacity .2s ease, transform .2s ease; }
.topic-card.is-open .topic-drawer__item { opacity: 1; transform: none; }
.topic-card.is-open .topic-drawer__item:nth-child(1) { transition-delay: .03s; }
.topic-card.is-open .topic-drawer__item:nth-child(2) { transition-delay: .06s; }
.topic-card.is-open .topic-drawer__item:nth-child(3) { transition-delay: .09s; }
.topic-card.is-open .topic-drawer__item:nth-child(4) { transition-delay: .12s; }
.topic-card.is-open .topic-drawer__item:nth-child(5) { transition-delay: .15s; }
.topic-card.is-open .topic-drawer__item:nth-child(6) { transition-delay: .18s; }

.topic-drawer__item a {
  position: relative; display: flex; align-items: baseline; gap: .6rem;
  padding: .45rem .7rem; border-radius: .5rem; color: var(--text-color); text-decoration: none;
  transition: background-color .2s ease;
}
.topic-drawer__item a::before {
  content: ""; position: absolute; left: 0; top: 50%; width: 2px; height: 0;
  background: #5684ff; border-radius: 2px; transform: translateY(-50%); transition: height .22s ease;
}
.topic-drawer__item a:hover, .topic-drawer__item a:focus { background: rgba(86, 132, 255, .07); }
.topic-drawer__item a:hover::before, .topic-drawer__item a:focus::before { height: 70%; }
.topic-drawer__index { color: var(--sec-text-color); font-size: .78rem; font-variant-numeric: tabular-nums; }
.topic-drawer__name { flex: 1; line-height: 1.35; }
.topic-drawer__date { color: var(--sec-text-color); font-size: .78rem; white-space: nowrap; }

[data-user-color-scheme="dark"] .topic-drawer,
@media (prefers-color-scheme: dark) {
  html:not([data-user-color-scheme]) .topic-drawer {
    background: rgba(28, 32, 40, .74);
    border-color: rgba(255, 255, 255, .08);
    box-shadow: 0 12px 32px rgba(0, 0, 0, .45);
  }
}
[data-user-color-scheme="dark"] .topic-card::before {
  background: radial-gradient(130% 90% at 50% 0%, rgba(120, 160, 255, .10), rgba(120, 160, 255, 0) 70%);
}

@media (max-width: 767px) {
  .topic-drawer { left: .5rem; right: .5rem; }
}

@media (prefers-reduced-motion: reduce) {
  .topic-drawer, .topic-card::before, .topic-drawer__item { transition: none !important; }
  .topic-card.is-open .topic-drawer__item { transition-delay: 0 !important; }
}
```

> 注：上例第 4 段暗色选择器写法有误（不能与 `@media` 混写在选择器列表）；落地时拆为两段：`[data-user-color-scheme="dark"] .topic-drawer { ... }` 与 `@media (prefers-color-scheme: dark) { html:not([data-user-color-scheme]) .topic-drawer { ... } }`。

---

### Task 5：新增 `topic-drawer.js`

**Files:** Create `source/js/topic-drawer.js`

- [ ] **Step 1**：写入完整交互逻辑。

```js
(function () {
  'use strict';

  function init() {
    var cards = document.querySelectorAll('.topic-card');
    if (!cards.length) return;

    var hoverNone = window.matchMedia && window.matchMedia('(hover: none)').matches;
    var CLOSE_DELAY = 200;

    Array.prototype.forEach.call(cards, function (card) {
      var drawer = card.querySelector('.topic-drawer');
      var closeTimer = null;
      var isOpen = false;

      function open() {
        if (isOpen) return;
        isOpen = true;
        if (closeTimer) { clearTimeout(closeTimer); closeTimer = null; }
        card.classList.add('is-open');
        card.setAttribute('aria-expanded', 'true');
        if (drawer) drawer.setAttribute('aria-hidden', 'false');
      }

      function close() {
        if (!isOpen) return;
        isOpen = false;
        card.classList.remove('is-open');
        card.setAttribute('aria-expanded', 'false');
        if (drawer) drawer.setAttribute('aria-hidden', 'true');
      }

      function scheduleClose() {
        if (closeTimer) clearTimeout(closeTimer);
        closeTimer = setTimeout(function () {
          if (card.contains(document.activeElement)) return;
          close();
        }, CLOSE_DELAY);
      }

      if (!hoverNone) {
        card.addEventListener('mouseenter', open);
        card.addEventListener('mouseleave', scheduleClose);
      }

      card.addEventListener('focusin', open);
      card.addEventListener('focusout', function () {
        setTimeout(function () {
          if (!card.contains(document.activeElement)) close();
        }, 0);
      });

      card.addEventListener('click', function (e) {
        if (hoverNone && !isOpen) {
          e.preventDefault();
          open();
        }
      });

      card.addEventListener('keydown', function (e) {
        if (e.key === 'Escape' || e.keyCode === 27) {
          close();
          card.focus();
        }
      });
    });
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }
})();
```

---

### Task 6：注册资源

**Files:** Modify `themes/fluid/_config.yml`（`custom_js` / `custom_css` 列表，约 240–252 行）

- [ ] **Step 1**：在 `custom_js` 列表末尾加 `- /js/topic-drawer.js`。
- [ ] **Step 2**：在 `custom_css` 列表末尾加 `- /css/topic-card.css`。

---

### Task 7：构建与验收

- [ ] **Step 1**：`npx hexo generate`，确认无 `ERROR`（`Reference/DockerDDM.md` 为既有无关错误）。
- [ ] **Step 2**：`npx hexo server -p 4001`，打开首页，逐条核对验收标准：
  1. 出现 1 张「夜谈」专题卡，抽屉 3 条按 04:03 → 08:30 → 09:40 升序；
  2. 悬停平滑展开、移出 200ms 收起、`Esc` 收起；
  3. 键盘 Tab 聚焦可展开，`aria-expanded` 切换；
  4. 光晕不遮挡正文；暗色模式对比正常；
  5. 无 `series` 的文章渲染不变；
  6. 窄屏点击可展开、抽屉不溢出。
- [ ] **Step 3**：更新 `Log.md`（v0.6）。

---

## Self-Review

- **规格覆盖**：聚合判定(T1/T3)、专题卡与抽屉(T2)、交互(T5)、视觉/暗色/响应式/减动效(T4)、资源挂载(T6)、验收(T7) —— 均有用例。
- **占位符**：无 TBD；T4 已显式修正暗色选择器写法。
- **命名一致**：`seriesKey` / `renderedSeries` / `drawerId` / `is-open` / `aria-expanded` 全链路一致。
