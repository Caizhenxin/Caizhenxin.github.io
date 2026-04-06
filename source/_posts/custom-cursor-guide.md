---
title: 给博客换上胡桃鼠标！Hexo 自定义光标完整教程
date: 2026-04-06 15:00:00
tags:
  - Hexo
  - 教程
  - 博客美化
  - 原神
categories:
  - 技术分享
---

# 🖱️ 给博客换上胡桃鼠标！Hexo 自定义光标完整教程

> 看腻了系统默认的箭头光标？想让你的博客更有个性？
> 这篇文章将教你如何在 Hexo 博客中自定义鼠标光标，从默认箭头到胡桃指针，只需几步！

![Cursor Demo](https://img.shields.io/badge/Cursor-Custom-brightgreen)
![Hexo](https://img.shields.io/badge/Hexo->=5.0-blue)

## ✨ 效果预览

将博客的默认箭头替换为你喜欢的自定义图标——比如原神胡桃的可爱光标！

- **默认状态**：显示胡桃的默认箭头
- **悬停链接/按钮**：自动切换为胡桃的点击手势

---

## 🛠️ 准备工作

**本项目环境：**
- Hexo 8.0+
- 主题：Fluid
- 光标格式：`.cur`（静态光标文件）

> ⚠️ **重要提醒**：浏览器**不支持 `.ani` 格式的动态光标**！Chrome、Firefox、Safari 等主流浏览器都无法渲染 `.ani` 文件。请使用 `.cur`（静态光标）或 `.png` 格式。

---

## 🚀 第一步：获取光标文件

### 推荐资源网站（免费）

| 网站 | 说明 |
| :--- | :--- |
| [Sweezy Cursors](https://sweezy-cursors.com/collection/genshin-impact/) | 大量原神主题光标，质量很高 |
| [主题之家](https://zhutix.com/ico/ys-faio-cu/) | 中文站点，原神光标合集 |
| [RW-Designer](http://www.rw-designer.com/cursor-library) | 老牌光标库，资源极其丰富 |

### 下载后注意

1. 确认文件格式为 **`.cur`**（静态光标）
2. 如果下载的是 `.ani` 格式，需要转换为 `.cur`（见下方 FAQ）
3. 推荐尺寸为 **32x32 像素**，过大会导致光标显示异常

---

## 📁 第二步：放置光标文件

在你的 Hexo 博客根目录下，创建光标文件目录：

```bash
# 在 source 目录下创建 cursors/elaina 文件夹
mkdir -p source/cursors/elaina
```

将下载好的 `.cur` 文件放入该目录，例如：

```
source/
├── cursors/
│   └── elaina/
│       ├── default.cur      # 默认光标
│       └── pointer.cur      # 链接/按钮悬停光标
├── css/
│   └── cursors.css          # 光标样式文件（下一步创建）
└── ...
```

> 💡 **文件命名建议**：使用英文命名（如 `default.cur`、`pointer.cur`），避免中文文件名可能带来的 URL 编码问题。

---

## 🎨 第三步：创建 CSS 样式文件

在 `source/css/` 目录下创建 `cursors.css` 文件：

```css
/* 自定义鼠标光标样式 */

/* 默认光标（普通状态） */
body {
  cursor: url('/cursors/elaina/default.cur') 0 0, auto;
}

/* 链接和可点击元素（悬停状态） */
a,
a *,
button,
button *,
input[type="submit"],
input[type="button"],
input[type="reset"],
label,
select,
summary,
[role="button"],
[onclick] {
  cursor: url('/cursors/elaina/pointer.cur') 0 0, pointer;
}
```

### 代码说明

| 代码部分 | 含义 |
| :--- | :--- |
| `url('/cursors/elaina/default.cur')` | 光标文件路径，相对于网站根目录 |
| `0 0` | 热点坐标（点击点），格式为 `X Y`，通常设为 `0 0` |
| `auto` / `pointer` | 回退值，如果光标文件加载失败则使用系统默认 |

---

## ⚙️ 第四步：在主题中引入 CSS

打开主题配置文件 `themes/fluid/_config.yml`（如果你使用了覆盖配置，则是博客根目录的 `_config.fluid.yml`），找到 `custom_css` 配置项：

```yaml
custom_css:
  - /css/lang-switch.css
  - /css/cursors.css    # 添加这一行
```

> 💡 如果没有 `custom_css` 配置项，手动添加即可。

---

## 🧪 第五步：本地预览

每次修改后，都可以通过以下命令快速预览效果：

```bash
hexo clean    # 清理缓存（修改 CSS 后建议执行）
hexo g        # 生成静态文件（generate 的缩写）
hexo s        # 启动本地服务器（server 的缩写）
```

然后打开浏览器访问 `http://localhost:4000`，即可看到自定义光标效果。

> 💡 **快捷键小技巧**：可以将这三条命令合并为一行：
> ```bash
> hexo clean && hexo g && hexo s
> ```

---

## 🚀 第六步：部署上线

确认效果无误后，推送到 GitHub：

```bash
git add .
git commit -m "feat: 添加自定义鼠标光标"
git push origin main
```

等待 GitHub Actions 自动构建部署完成，访问你的博客即可看到效果！

---

## 🎯 进阶：添加更多状态的光标

上面的配置只实现了两种状态（默认 + 悬停链接）。如果你想让博客更加精致，可以为不同场景设置不同的光标：

```css
/* ===== 自定义鼠标光标样式 - 完整版 ===== */

/* 默认光标 */
body {
  cursor: url('/cursors/elaina/default.cur') 0 0, auto;
}

/* 链接和可点击元素 */
a,
a *,
button,
button *,
input[type="submit"],
input[type="button"],
input[type="reset"],
label,
select,
summary,
[role="button"],
[onclick] {
  cursor: url('/cursors/elaina/pointer.cur') 0 0, pointer;
}

/* 文本输入区域 */
input[type="text"],
input[type="email"],
input[type="password"],
input[type="search"],
input[type="tel"],
input[type="url"],
textarea,
[contenteditable="true"] {
  cursor: url('/cursors/elaina/text.cur') 0 0, text;
}

/* 忙碌状态（加载中） */
.busy,
.loading {
  cursor: url('/cursors/elaina/wait.cur') 0 0, wait;
}

/* 水平调整大小 */
.col-resize,
[data-resize="horizontal"] {
  cursor: url('/cursors/elaina/resize-h.cur') 0 0, ew-resize;
}

/* 垂直调整大小 */
.row-resize,
[data-resize="vertical"] {
  cursor: url('/cursors/elaina/resize-v.cur') 0 0, ns-resize;
}

/* 移动/拖拽 */
.move,
[draggable="true"] {
  cursor: url('/cursors/elaina/move.cur') 0 0, move;
}

/* 精确选择/十字光标 */
.crosshair,
.precise-select {
  cursor: url('/cursors/elaina/crosshair.cur') 0 0, crosshair;
}

/* 不可用/禁用 */
.disabled,
[disabled] {
  cursor: url('/cursors/elaina/not-allowed.cur') 0 0, not-allowed;
}

/* 帮助选择 */
.help-select {
  cursor: url('/cursors/elaina/help.cur') 0 0, help;
}
```

### 添加新光标的步骤

1. **下载/制作对应的 `.cur` 文件**，放入 `source/cursors/elaina/` 目录
2. **在 `cursors.css` 中添加新的 CSS 规则**（参考上面的完整版代码）
3. **运行 `hexo clean && hexo g && hexo s`** 预览效果
4. 确认无误后 `git push` 部署

> 💡 不需要一次性全部实现！可以先从默认和链接两种状态开始，后续慢慢补充。

---

## ❓ 常见问题 (FAQ)

### Q1: 光标不显示怎么办？

1. **检查文件格式**：确认是 `.cur` 格式，不是 `.ani`（浏览器不支持 `.ani`）
2. **检查文件路径**：CSS 中的路径必须以 `/` 开头（如 `/cursors/elaina/default.cur`）
3. **检查文件是否存在**：在浏览器中直接访问 `http://localhost:4000/cursors/elaina/default.cur`，看是否能下载文件
4. **清除浏览器缓存**：按 `Ctrl + Shift + R` 强制刷新
5. **检查 CSS 是否加载**：按 `F12` 打开开发者工具 → Network 标签 → 筛选 CSS → 确认 `cursors.css` 返回 200

### Q2: 光标太大了怎么办？

浏览器光标推荐尺寸为 **32x32 像素**。如果你的光标文件尺寸过大，需要调整：

**方法 1：使用 ImageMagick（命令行）**
```bash
# 安装：winget install ImageMagick.ImageMagick
magick convert "原文件.cur[0]" -resize 32x32 "输出文件.cur"
```

**方法 2：在线转换**
- 使用 https://convertio.co/zh/ 等在线工具，先转为 PNG 调整尺寸后再转回 `.cur`

**方法 3：用画图工具**
- 右键 `.cur` → 打开方式 → 画图 → 重新调整大小为 32x32 → 另存为

### Q3: 只有 `.ani` 文件怎么办？

浏览器不支持 `.ani` 动态光标！你需要转换为 `.cur`：

- **在线转换**：https://convertio.co/zh/ani-cur/
- **本地转换**：使用 RealWorld Cursor Editor 或 ImageMagick
- **替代方案**：从上面推荐的网站重新下载 `.cur` 格式的版本

### Q4: 中文文件名会导致问题吗？

有可能。URL 中的中文字符需要进行百分号编码（Percent-encoding），不同浏览器处理方式可能不同。

**推荐做法**：光标文件使用英文命名，如 `default.cur`、`pointer.cur`、`text.cur` 等。

### Q5: 如何为特定页面设置不同的光标？

可以在特定页面的 Front-matter 中添加自定义 CSS，或者在页面模板中单独引入不同的光标样式文件。

---

## 📝 总结

自定义鼠标光标是一个让博客变得个性十足的小改动。虽然它只是一个视觉上的装饰，但能给访客带来不一样的浏览体验。

**核心要点回顾：**
- ✅ 使用 `.cur` 格式（不支持 `.ani`）
- ✅ 推荐尺寸 32x32 像素
- ✅ 文件放在 `source/cursors/` 目录下
- ✅ CSS 路径以 `/` 开头
- ✅ 每次修改后 `hexo clean && hexo g && hexo s` 预览

如果你也想给你的博客换个新光标，赶紧动手试试吧！

> **作者**：Cai Zhenxin
> **博客**：[游手好闲辛大人](https://caizhenxin.github.io)
