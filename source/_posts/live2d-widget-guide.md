---
title: 给博客加个看板娘！Hexo + Live2D 超详细教程
date: 2026-04-05 20:00:00
tags:
  - Hexo
  - 教程
  - 看板娘
  - Live2D
categories:
  - 技术分享
---

# 🎀 给博客加个看板娘！Hexo + Live2D 超详细教程

> 觉得一个人写博客太孤单？想让你的博客更有活力？
> 这篇文章将教你如何在 Hexo 博客中添加一个可爱的 Live2D 看板娘！

![Live2D Demo](https://img.shields.io/badge/Live2D-Widget-brightgreen)
![Hexo](https://img.shields.io/badge/Hexo->=5.0-blue)

## ✨ 效果预览

看看你博客右下角（或左下角），是不是多了一个可爱的动漫角色？
她不仅会动，还会跟随你的鼠标转头，甚至点击她还有互动效果哦！

![看板娘示例](https://cdn.jsdelivr.net/gh/EYHN/hexo-helper-live2d/screenshots/preview.png)

---

## 🛠️ 准备工作

确保你的博客是基于 **Hexo** 搭建的。如果你使用的是其他博客框架（如 Hugo、Valaxy），可能需要寻找对应的插件。

**本项目环境：**
- Hexo 8.0+
- 主题：Fluid
- 插件：`hexo-helper-live2d`

---

## 🚀 第一步：安装插件

在你的博客根目录下，打开终端（PowerShell 或 CMD），运行以下命令安装核心插件：

```bash
npm install --save hexo-helper-live2d
```

---

## 🎨 第二步：选择并安装模型

看板娘的“皮肤”就是模型。官方提供了很多模型供你选择。

### 1. 热门模型推荐

| 模型名称 | 风格描述 | 安装命令 |
| :--- | :--- | :--- |
| **hijiki** | 🐱 高冷黑猫娘（本站同款） | `npm install live2d-widget-model-hijiki` |
| **tororo** | 🐱 活泼白猫娘 | `npm install live2d-widget-model-tororo` |
| **shizuku** | 👧 经典女学生 | `npm install live2d-widget-model-shizuku` |
| **koharu** | 👧 可爱粉发萝莉 | `npm install live2d-widget-model-koharu` |
| **miku** | 🎤 初音未来 | `npm install live2d-widget-model-miku` |
| **wanko** | 🐶 萌系小狗娘 | `npm install live2d-widget-model-wanko` |

### 2. 安装模型

以我使用的 **hijiki** 为例：

```bash
npm install live2d-widget-model-hijiki
```

*提示：你可以同时安装多个模型，然后在配置文件中随时切换。*

---

## ⚙️ 第三步：配置 `_config.yml`

打开博客根目录下的 `_config.yml`（注意不是主题目录下的），在文件末尾添加以下配置：

```yaml
# Live2D 看板娘配置
# 文档：https://github.com/EYHN/hexo-helper-live2d
live2d:
  enable: true
  scriptFrom: local
  pluginRootPath: live2dw/
  pluginJsPath: lib/
  pluginModelPath: assets/
  tagMode: false
  log: false
  model:
    use: live2d-widget-model-hijiki  # 这里填你安装的模型包名
  display:
    position: right  # 位置：left 或 right
    width: 150       # 宽度
    height: 300      # 高度
  mobile:
    show: false      # 移动端是否显示（建议 false，避免遮挡内容）
  react:
    opacity: 0.7     # 透明度
```

---

## 📱 第四步：移动端适配（重要）

由于手机屏幕较小，看板娘很容易遮挡正文或导航栏。

**推荐做法**：在配置中设置 `mobile: show: false`（如上所示）。

**进阶做法**：如果你非要在移动端显示，可以添加自定义 CSS 来调整大小：

```css
/* source/css/custom.css */
@media (max-width: 768px) {
  #live2dcanvas {
    transform: scale(0.5);
    transform-origin: bottom right;
  }
}
```

---

## 🧪 第五步：本地预览与部署

### 1. 本地预览

清理缓存并重新生成：

```bash
hexo clean
hexo g
hexo s
```

打开 `http://localhost:4000`，你应该就能看到看板娘了！

### 2. 部署上线

确认无误后，推送到 GitHub：

```bash
git add .
git commit -m "feat: add live2d widget"
git push origin main
```

等待 GitHub Actions 部署完成，你的博客就有看板娘陪伴啦！🎉

---

## ❓ 常见问题 (FAQ)

### Q1: 看板娘不显示怎么办？
1. 检查 `_config.yml` 缩进是否正确（YAML 对缩进非常敏感）。
2. 检查模型包名是否拼写正确。
3. 尝试 `hexo clean` 清除缓存。
4. 按 `F12` 打开浏览器控制台，查看是否有报错（如 404 找不到模型文件）。

### Q2: 加载速度太慢？
部分模型文件较大（如 miku 可能达到 5MB+）。
- **解决方法**：选择体积较小的模型（如 hijiki, tororo 等通常在 1MB 左右）。
- **解决方法**：配置 CDN 加速（插件默认使用本地加载，已是最快方式）。

### Q3: 如何自定义对话？
插件默认包含了一些随机对话。如果需要自定义，可以在模型目录下创建 `messages.json`，或者使用第三方工具生成对话配置。

### Q4: 看板娘挡住评论区了？
调整配置中的 `display.position` 为 `left`，或者调整 `vOffset`（垂直偏移量）。

---

## 📝 总结

添加看板娘是一个让博客变得生动有趣的简单方法。虽然它只是一个前端的小组件，但能给访客带来不一样的浏览体验。

如果你也想给你的博客加一个小伙伴，赶紧动手试试吧！

> **作者**：Cai Zhenxin
> **博客**：[游手好闲辛大人](https://caizhenxin.github.io)
