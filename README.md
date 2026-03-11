# 🌐 Cai Zhenxin's Personal Blog

这是一个使用 **Valaxy** 框架构建的个人技术博客网站。

---

## 🚀 快速开始（本地开发）

### 第一步：安装依赖

在项目根目录打开终端（Terminal/命令行），运行：

```bash
pnpm install
```

> 💡 **提示**：如果没有安装 pnpm，可以先运行 `npm install -g pnpm` 来安装它。

### 第二步：启动本地服务器

在终端中运行：

```bash
pnpm dev
```

> **注意**：
> - 启动后，终端通常会显示一个网址，例如 `http://localhost:5173` 或 `http://localhost:3000`。
> - **不要**直接访问 `http://localhost:8000`，那是以前的配置，现在已经更改了。
> - 请查看终端输出的实际端口号，通常是 **5173**。

### 第三步：查看网页

1. 打开浏览器（Chrome/Edge/Firefox）。
2. 在地址栏输入终端显示的网址（例如 `http://localhost:5173`）。
3. 按回车键即可看到网站效果。

---

## 🛠️ 网站开发版本说明

本项目目前包含以下开发版本（分支）：

### 1. `main` 分支（源代码版）
- **用途**：存放网站的源代码（Markdown 文章、Vue 组件、配置文件）。
- **适合**：开发者修改内容、更新主题配置。
- **文件结构**：
  - `pages/`：存放博客文章（Markdown 格式）。
  - `valaxy.config.ts`：网站配置文件。
  - `.github/workflows/`：自动部署脚本。

### 2. `gh-pages` 分支（发布版）
- **用途**：存放编译后的静态网页文件（HTML/CSS/JS）。
- **适合**：GitHub Pages 自动部署，用户直接访问 `https://caizhenxin.github.io`。
- **生成方式**：运行 `pnpm build` 后自动生成到 `dist/` 目录，然后推送到此分支。

---

## 🛠️ 常用命令

| 命令 | 说明 |
|------|------|
| `pnpm dev` | 启动本地开发服务器（热更新） |
| `pnpm build` | 编译生成静态网页（用于部署） |
| `pnpm preview` | 预览编译后的网页 |

---

## ❓ 常见问题

**Q: 为什么直接访问 http://localhost:8000 没反应？**
> A: 因为最新版本的开发服务器端口已更改为 **5173**。请运行 `pnpm dev` 后查看终端输出的端口号。

**Q: 如何添加新文章？**
> A: 在 `pages/posts/` 目录下创建新的 Markdown 文件（例如 `my-first-post.md`），并按照 frontmatter 格式编写。

**Q: 如何部署到 GitHub Pages？**
> A: 代码推送到 `main` 分支后，GitHub Actions 会自动构建并部署到 `gh-pages` 分支，网站会自动更新。

---

## 📝 许可证

ISC License
