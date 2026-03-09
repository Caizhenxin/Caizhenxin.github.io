# Valaxy 个人博客网站搭建计划

## TL;DR

> **快速概要**: 使用 Valaxy 静态博客框架 + valaxy-theme-yun 主题，在 GitHub Pages 上搭建个人技术博客和作品集网站。
> 
> **交付成果**: 
> - 可访问的个人网站 (caizhenxin.github.io)
> - 完整的博客功能（热更新开发体验）
> - 自动部署流水线
> 
> **预计工作量**: 中等 (需分阶段完成)
> **并行执行**: 部分阶段可并行
> **关键路径**: 环境安装 → 项目初始化 → 主题配置 → GitHub 部署

---

## 上下文

### 原始需求
在 GitHub 上搭建个人网站，使用 Valaxy + valaxy-theme-yun 主题，用于技术博客和个人作品集展示。

### 访谈总结
**关键讨论**:
- **开发环境**: 用户本地未安装 Git、Node.js、npm，需要从零开始
- **部署方式**: 本地开发 → GitHub 自动部署（推荐方案）
- **网站用途**: 技术博客 + 个人简历/作品集
- **最终选择**: Valaxy + valaxy-theme-yun（替代原 hexo-theme-yun）

### ⚠️ 重要发现
**hexo-theme-yun 已进入维护模式**，作者推荐使用 **Valaxy** 作为继任者。用户已确认选择 Valaxy + valaxy-theme-yun。

### Metis 审查
**已识别并解决的问题**:
- Node.js 版本兼容性问题 (Hexo 需要 Node 14+)
- Windows 环境的特殊性
- GitHub Actions 部署密钥配置

---

## 工作目标

### 核心目标
搭建一个托管在 GitHub Pages 上的个人博客网站，具备：
- 技术博客文章发布功能
- 个人简历/作品集展示页面
- 自动部署到 GitHub Pages

### 具体交付物
- [ ] 本地可运行的 Valaxy 开发环境
- [ ] 配置好 valaxy-theme-yun 主题的博客项目
- [ ] GitHub 源码仓库（私有）
- [ ] GitHub Pages 公开仓库 (caizhenxin.github.io)
- [ ] 自动部署的 GitHub Actions 配置
- [ ] 初始化好的博客页面和示例文章

### 完成定义
- [ ] 本地运行 `valaxy` 可以预览网站（热更新）
- [ ] push 代码到 GitHub 后网站自动更新
- [ ] 网站可以通过 caizhenxin.github.io 访问

### 必须有
- [ ] Node.js 18+ (LTS)
- [ ] Git 已配置
- [ ] GitHub 账户 (Cai zhenxin)
- [ ] 主题配置文件 (valaxy.config.ts)

### 必须没有
- [ ] 硬编码的敏感信息（如 API keys）
- [ ] 未经测试的直接 push 到 main 分支

---

## 验证策略

### 测试决策
- **基础设施**: 项目本身即静态生成，无需单元测试
- **自动化测试**: 无
- **QA 方式**: 人工验证为主 - 本地预览 + GitHub Pages 访问验证
- **每次任务后**: 执行 `pnpm dev` 本地预览确认效果

### QA 策略
每个任务包含人工验证场景：
- 本地开发：`pnpm dev` 预览（热更新）
- 部署验证: 访问 https://caizhenxin.github.io
- 功能测试：点击导航、查看文章、验证主题效果

---

## 执行策略

### 阶段划分

**第一阶段：环境准备 (Wave 1)**
- 安装 Node.js 和 npm
- 安装 Git
- 配置 GitHub 账户

**第二阶段：项目初始化 (Wave 2)**
- 初始化 Valaxy 项目
- 安装主题和依赖
- 本地预览验证（热更新）

**第三阶段：配置与定制 (Wave 3)**
- 基础配置 (valaxy.config.ts)
- 主题配置 (valaxy.config.ts)
- 创建个人简历/关于页面

**第四阶段：GitHub 部署 (Wave 4)**
- 创建 GitHub 仓库
- 配置 GitHub Actions
- 首次部署验证

---

## TODOs

- [ ] 1. 安装 Node.js 和 npm

  **要做的事**:
  - 下载并安装 Node.js 18 LTS (Windows版)
  - 验证安装: 运行 `node --version` 和 `npm --version`
  - 建议使用 nvm-windows 管理 Node.js 版本

  **推荐工具**:
  - nvm-windows: https://github.com/coreybutler/nvm-windows
  - 直接安装: https://nodejs.org/

  **验收标准**:
  - [ ] `node --version` 显示 v18.x.x
  - [ ] `npm --version` 显示 8.x.x 或更高

- [ ] 2. 安装和配置 Git

  **要做的事**:
  - 下载并安装 Git for Windows
  - 配置用户名和邮箱: `git config --global user.name "Your Name"` / `git config --global user.email "your@email.com"`
  - 生成 SSH 密钥（用于 GitHub 推送）: `ssh-keygen -t ed25519 -C "your@email.com"`
  - 将公钥添加到 GitHub 账户

  **验收标准**:
  - [ ] `git --version` 显示 Git 版本
  - [ ] 可以无密码 SSH 连接到 GitHub

- [ ] 3. 初始化 Valaxy 项目

  **要做的事**:
  - 推荐使用 pnpm: 先安装 pnpm: `npm install -g pnpm`
  - 创建项目目录: `mkdir my-blog && cd my-blog`
  - 初始化 Valaxy: `pnpm create valaxy` 或 `npm init valaxy`
  - 按引导选择 valaxy-theme-yun 主题
  - 安装依赖: `pnpm install` 或 `npm install`

  **参考**:
  - 官方文档: https://valaxy.site/
  - 快速开始: https://valaxy.site/guide/getting-started

  **验收标准**:
  - [ ] 目录包含 node_modules/ 或 pnpm-lock.yaml
  - [ ] 运行 `pnpm dev` 或 `npm run dev` 可以启动本地服务器（带热更新）

- [ ] 4. 安装 valaxy-theme-yun 主题

  **要做的事**:
  - 如果初始化时已选择 valaxy-theme-yun，则已包含
  - 如需手动安装: `pnpm add valaxy-theme-yun`
  - 在 valaxy.config.ts 中配置主题:
    ```ts
    import { defineValaxyConfig } from 'valaxy'
    import { themeYun } from 'valaxy-theme-yun'
    
    export default defineValaxyConfig({
      theme: 'yun',
      themeConfig: {
        // 主题配置
      }
    })
    ```

  **参考**:
  - valaxy-theme-yun: https://github.com/YunYouJun/valaxy-theme-yun
  - 主题配置: https://yun.yunyoujun.cn/

  **验收标准**:
  - [ ] valaxy.config.ts 中 theme 设置为 'yun'
  - [ ] 本地预览可以看到云主题样式

- [ ] 5. 本地预览和基础配置

  **要做的事**:
  - 运行 `pnpm dev` 本地预览（享受热更新体验！）
  - 配置站点信息 (valaxy.config.ts):
    - title: 网站标题
    - author: 作者名
    - lang: zh-CN (或 en)
    - url: https://caizhenxin.github.io
  - 配置主题 (valaxy.config.ts 中的 themeConfig):
    - avatar: 头像
    - social: 社交链接
    - menu: 菜单项

  **验收标准**:
  - [ ] http://localhost:3000 可以访问（默认端口可能不同，以实际为准）
  - [ ] 网站标题、作者显示正确
  - [ ] 修改文件后页面自动更新（热更新验证）

- [ ] 6. 创建示例内容

  **要做的事**:
  - Valaxy 使用 Markdown 文件，直接在 pages/posts/ 目录创建
  - 创建"关于"页面: 编辑 pages/about/index.md
  - 创建示例博客文章: 创建 pages/posts/hello-valaxy.md
  - 文章frontmatter格式:
    ```yaml
    ---
    title: Hello Valaxy
    date: 2024-01-01
    tags:
      - 技术
    categories:
      - 博客
    ---
    ```

  **验收标准**:
  - [ ] 导航栏显示"关于"链接
  - [ ] 博客列表显示示例文章
  - [ ] 热更新正常工作

- [ ] 7. 初始化 Git 并推送源码

  **要做的事**:
  - 当前目录已是 caizhenxin.github.io 仓库
  - 初始化 Valaxy 项目（将在当前目录生成文件）
  - 创建 .gitignore 排除 node_modules 等
  - 推送到远程仓库:
    ```
    git add .
    git commit -m "init: 初始化 Valaxy 博客"
    git push -u origin main
    ```

  **注意**: 用户已创建 caizhenxin.github.io 仓库，无需再创建新仓库

  **验收标准**:
  - [ ] 源码已推送到 caizhenxin.github.io 仓库

- [ ] 8. 配置 GitHub Actions 自动部署

  **要做的事**:
  - 创建 .github/workflows/deploy.yml
  - 配置 workflow:
    - 触发: push 到 main 分支
    - 安装 Node.js
    - 安装 pnpm
    - 安装依赖
    - 生成静态文件
    - 推送到 caizhenxin.github.io 仓库

  **参考配置**:
  ```yaml
  name: Deploy to GitHub Pages
  
  on:
    push:
      branches:
        - main
  
  jobs:
    deploy:
      runs-on: ubuntu-latest
      steps:
        - uses: actions/checkout@v4
        
        - name: Setup pnpm
          uses: pnpm/action-setup@v2
          with:
            version: 8
            
        - name: Setup Node.js
          uses: actions/setup-node@v4
          with:
            node-version: '18'
            cache: 'pnpm'
            
        - name: Install dependencies
          run: pnpm install
            
        - name: Build site
          run: pnpm run build
            
        - name: Deploy
          uses: peaceiris/actions-gh-pages@v3
          with:
            github_token: ${{ secrets.GITHUB_TOKEN }}
            publish_dir: ./dist
  ```

  **验收标准**:
  - [ ] GitHub Actions 运行成功
  - [ ] 静态文件推送到 caizhenxin.github.io 仓库

- [ ] 9. 验证和上线

  **要做的事**:
  - 等待 GitHub Actions 完成
  - 访问 https://caizhenxin.github.io 查看网站
  - 如有问题，查看 Actions 日志排查
  - 首次部署成功！

  **验收标准**:
  - [ ] 网站可以通过 https://caizhenxin.github.io 访问
  - [ ] 内容与本地预览一致

---

## 最终验证阶段

- [ ] F1. 本地预览验证 — 运行 pnpm dev，确认热更新正常工作
- [ ] F2. GitHub Pages 访问验证 — 访问 caizhenxin.github.io 确认可访问
- [ ] F3. 自动部署验证 — 修改文章后 push，确认自动更新
- [ ] F4. 功能完整性检查 — 博客、分类、标签、搜索等功能

---

## 提交策略

- 每次功能完成后提交
- 格式: `type(scope): description`
- 示例: `feat(config): 添加主题配置文件`

---

## 成功标准

### 验证命令
```bash
# 本地预览（带热更新）
pnpm dev
# 预期：本地 http://localhost:3000 显示网站，修改文件自动更新

# 构建静态文件
pnpm build
# 预期：在 dist/ 目录生成静态文件

# 部署后
# 访问 https://caizhenxin.github.io
# 预期：显示与本地一致的网站
```

### 最终检查清单
- [ ] 本地开发环境正常运行
- [ ] GitHub Pages 可以访问
- [ ] 自动部署正常工作
- [ ] 主题配置正确生效
