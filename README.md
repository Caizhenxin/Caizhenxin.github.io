# Cai Zhenxin 的个人博客

基于 Valaxy 和 Yun 主题构建的静态博客站点，部署在 GitHub Pages 上。

## 技术栈

- **静态站点生成器**: Valaxy v0.28.0-beta.1
- **主题**: valaxy-theme-yun v0.27.0
- **前端框架**: Vue 3 + TypeScript
- **构建工具**: Vite
- **部署平台**: GitHub Pages

## 功能特性

- 🎨 简洁美观的 Yun 主题设计
- 📝 Markdown 文章写作支持
- 🔍 全文搜索功能
- 📱 响应式布局
- 🏷️ 标签与分类系统
- 📊 文章归档
- 🌓 深色/浅色模式
- 🔄 自动 RSS 生成

## 快速开始

### 环境要求

- Node.js 18+ 
- pnpm 8+ (推荐) 或 npm / yarn

### 安装依赖

```bash
pnpm install
```

### 开发模式

```bash
pnpm dev
```

访问 `http://localhost:4859/` 查看本地预览。

### 构建静态文件

```bash
pnpm build
```

构建后的文件位于 `dist/` 目录。

### 预览构建结果

```bash
pnpm preview
```

## 项目结构

```
.
├── pages/                    # 页面内容
│   ├── posts/               # 博客文章 (Markdown)
│   │   ├── blog-journey.md  # 博客搭建历程
│   │   ├── vue3-notes.md    # Vue 3 学习笔记
│   │   ├── github-actions-guide.md # GitHub Actions 指南
│   │   └── hello-world.md   # 欢迎文章
│   └── about/               # 关于页面
├── layouts/                 # 布局组件
├── public/                  # 静态资源
├── valaxy.config.ts         # Valaxy 配置文件
└── package.json             # 项目依赖
```

## 配置说明

主要配置在 `valaxy.config.ts` 中：

- **站点信息**: 标题、作者、描述、URL
- **主题配置**: 横幅标题、社交链接、页面导航、页脚
- **构建选项**: SSG 分页、路由配置

## 写作指南

在 `pages/posts/` 目录下创建 `.md` 文件，使用 Front Matter 定义元数据：

```markdown
---
title: 文章标题
date: 2026-03-10
tags:
  - 标签1
  - 标签2
categories:
  - 分类
---

# 文章内容

使用 Markdown 语法编写内容...
```

## 部署到 GitHub Pages

本项目已配置 GitHub Actions 工作流，自动构建并部署到 GitHub Pages：

1. 推送代码到 `main` 分支
2. GitHub Actions 自动运行构建
3. 构建结果部署到 `gh-pages` 分支
4. 通过 `https://caizhenxin.github.io` 访问

工作流文件：`.github/workflows/deploy.yml`

## 开发工作流

### 添加新文章

1. 在 `pages/posts/` 中创建新的 `.md` 文件
2. 编写 Front Matter 和内容
3. 提交并推送到 GitHub

### 修改主题配置

编辑 `valaxy.config.ts` 中的 `themeConfig` 部分。

### 自定义布局

在 `layouts/` 目录中添加或修改 Vue 组件。

## 常见问题

### 1. 本地开发时提示 "No pages directory found in dev"

确保在项目根目录下运行 `pnpm dev`，Valaxy 会自动处理 pages 目录。

### 2. 构建后路由冲突错误

确保没有重复的页面文件，特别是 `pages/index.vue` 与主题的 index.vue 冲突。

### 3. 标题显示不正确

检查 `valaxy.config.ts` 中的 `themeConfig.banner.title` 配置。

## 相关链接

- [Valaxy 文档](https://valaxy.site/)
- [Yun 主题文档](https://yun.yunyoujun.cn/)
- [GitHub 仓库](https://github.com/Caizhenxin/Caizhenxin.github.io)

## 许可证

MIT License
