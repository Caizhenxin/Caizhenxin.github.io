# 🌐 Cai Zhenxin 的个人博客

> 游手好闲辛大人 — 一个基于 Hexo + Fluid 主题的静态博客站点，部署在 GitHub Pages 上。

🔗 **在线访问**: https://caizhenxin.github.io

---

## 📖 项目演进历程

### 版本一：Valaxy + Yun 主题（已弃用）

**技术栈**: Valaxy v0.28.0-beta.1 + valaxy-theme-yun v0.27.0 + Vue 3 + TypeScript

**完成的工作**:
- ✅ 成功搭建基础博客框架
- ✅ 部署到 GitHub Pages
- ✅ 添加了 3 篇博客文章（博客搭建历程、Vue 3 学习笔记、GitHub Actions 指南）
- ✅ 配置了 RSS 订阅、标签分类系统
- ✅ 自定义了首页布局（头像 + 个人介绍 + 文章列表）

**遇到的问题**:
1. **路由初始化错误**: Yun 主题的 `App.vue` 在组件初始化时访问 `route.meta`，但在 SSG 静态部署中 `route` 对象可能为 `undefined`，导致 `TypeError: Cannot read properties of undefined (reading 'meta')`
2. **构建依赖冲突**: 自定义 `App.vue` 时遇到 `@unhead/vue` 模块无法解析的问题
3. **主题兼容性问题**: Yun 主题与 Valaxy beta 版本之间存在多处兼容性问题，包括 `route.path`、`route.meta` 等属性在多个组件中未做安全检查
4. **反复修补无效**: 尝试了 `postinstall` 脚本自动修补主题文件、自定义布局等多种方案，但问题反复出现

**放弃原因**: Yun 主题对 `route` 对象的安全检查不足，在静态部署环境下频繁出现运行时错误。修补成本过高且不稳定，最终决定迁移到更成熟的 Hexo 生态。

---

### 版本二：Hexo + Fluid 主题（当前版本）✨

**技术栈**: Hexo v8.0 + hexo-theme-fluid v1.9.9 + Node.js 20

**完成的工作**:
- ✅ 成功迁移到 Hexo + Fluid 主题
- ✅ 配置 GitHub Actions 自动部署工作流
- ✅ 设计了个人"关于"页面（头像 + 社交链接 + 自我介绍 + 简历下载）
- ✅ 添加了博客维护指南文章
- ✅ 配置了响应式设计和深色模式适配
- ✅ 添加了 GitHub、Bilibili、邮箱等社交链接

**当前状态**: 🟢 稳定运行中

---

## 🛠️ 当前技术栈

| 组件 | 版本 |
|------|------|
| 静态站点生成器 | Hexo v8.0 |
| 主题 | Fluid v1.9.9 |
| 渲染器 | hexo-renderer-marked + hexo-renderer-stylus |
| 部署 | GitHub Actions → GitHub Pages |
| 包管理 | npm |

## ✨ 功能特性

- 🎨 优雅的 Material Design 风格主题
- 📝 Markdown 文章写作支持
- 📱 完全响应式布局
- 🏷️ 标签与分类系统
- 📊 文章归档
- 🌓 深色/浅色模式自动切换
- 🔍 本地搜索功能
- 🔄 自动化 CI/CD 部署

## 📁 项目结构

```
.
├── _config.yml              # Hexo 主配置文件
├── package.json             # 项目依赖
├── source/                  # 源文件目录
│   ├── _posts/              # 博客文章
│   ├── about/               # 关于页面
│   ├── img/                 # 图片资源
│   └── files/               # 下载文件（简历等）
├── scaffolds/               # 文章模板
├── themes/
│   └── fluid/               # Fluid 主题
└── .github/workflows/
    └── deploy.yml           # GitHub Actions 部署配置
```

## 🚀 快速开始

### 环境要求

- Node.js 20+
- npm

### 安装依赖

```bash
npm install
```

### 本地开发

```bash
npm run dev
# 或
npx hexo server
```

访问 `http://localhost:4000` 查看本地预览。

### 构建

```bash
npm run build
# 或
npx hexo generate
```

构建后的文件位于 `public/` 目录。

### 清理缓存

```bash
npm run clean
# 或
npx hexo clean
```

## ✍️ 写作指南

### 创建新文章

```bash
npx hexo new post "文章标题"
```

文件会生成在 `source/_posts/文章标题.md`，编辑内容：

```markdown
---
title: 文章标题
date: 2026-04-04 12:00:00
tags:
  - 标签1
  - 标签2
categories:
  - 分类
---

# 文章内容

使用 Markdown 语法编写内容...
```

### 创建新页面

```bash
npx hexo new page "页面名称"
```

## 🌍 部署到 GitHub Pages

本项目已配置 GitHub Actions 自动部署：

1. 推送代码到 `main` 分支
2. GitHub Actions 自动运行 `npm install` 和 `npm run build`
3. 构建结果部署到 `gh-pages` 分支
4. 通过 https://caizhenxin.github.io 访问

工作流文件：`.github/workflows/deploy.yml`

### 手动部署

```bash
git add .
git commit -m "更新内容描述"
git push origin main
```

等待 1-2 分钟，GitHub Actions 会自动完成部署。

## ⚙️ 配置说明

### 博客基本信息

编辑 `_config.yml`：

```yaml
title: 游手好闲辛大人
subtitle: '热爱技术，热爱生活'
description: '技术博客与个人作品集'
author: Cai Zhenxin
language: zh-CN
url: https://caizhenxin.github.io
```

### 主题配置

编辑 `themes/fluid/_config.yml` 可修改：
- 导航菜单
- 社交链接
- 头像
- 颜色主题
- 评论系统
- 等等...

## 📝 日常维护

| 任务 | 操作 |
|------|------|
| 添加新文章 | `npx hexo new post "标题"` → 编辑 → `git push` |
| 修改头像 | 替换 `source/img/avatar.jpg` → `git push` |
| 添加下载文件 | 放入 `source/files/` → `git push` |
| 修改主题配置 | 编辑 `themes/fluid/_config.yml` → `git push` |

## 🔗 相关链接

- [Hexo 官方文档](https://hexo.io/zh-cn/docs/)
- [Fluid 主题文档](https://hexo.fluid-dev.com/docs/)
- [GitHub 仓库](https://github.com/Caizhenxin/Caizhenxin.github.io)

## 📄 许可证

MIT License
## ✨ 更新频率
  <!--Activity Graph-->
[![Ashutosh's github activity graph](https://github-readme-activity-graph.vercel.app/graph?username=Caizhenxin&theme=react)](https://github.com/Caizhenxin/Caizhenxin.github.io)
