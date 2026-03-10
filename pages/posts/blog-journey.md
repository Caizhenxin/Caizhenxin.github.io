---
title: 从零搭建个人博客：我的技术选型与部署实战
date: 2026-03-10
tags:
  - 博客
  - 技术分享
  - Valaxy
  - GitHub Pages
categories:
  - 开发实践
---

# 从零搭建个人博客：我的技术选型与部署实战

最近终于完成了个人博客的搭建和部署，整个过程既有挑战也有收获。这篇文章记录了我的技术选型、遇到的问题以及最终的解决方案。

## 为什么选择静态博客？

在众多博客方案中，我最终选择了静态博客生成器，主要原因如下：

1. **性能优越** - 无需服务器动态渲染，访问速度快
2. **安全性高** - 没有数据库和后台管理，攻击面小
3. **成本低廉** - 可以免费部署在 GitHub Pages
4. **版本控制** - 内容与代码一起用 Git 管理
5. **开发体验好** - 支持 Markdown 写作，热重载开发

## 技术选型：Valaxy + valaxy-theme-yun

### 放弃 Hexo，选择 Valaxy

最初我考虑使用 Hexo，因为它是老牌的静态博客生成器，社区资源丰富。但深入研究后发现：

- **Hexo 的 yun 主题已进入维护模式** - 作者推荐使用 Valaxy
- **Valaxy 基于 Vue 3 + Vite** - 现代化的技术栈
- **更好的开发体验** - 支持热重载，配置更灵活
- **主题继承性** - valaxy-theme-yun 是 hexo-theme-yun 的继承者

### Valaxy 的核心优势

1. **Vue 3 驱动** - 享受 Composition API 的开发体验
2. **Vite 构建** - 极快的启动和热更新速度
3. **TypeScript 支持** - 更好的类型安全
4. **现代化的生态系统** - 与 Vue 生态完美集成

## 部署过程中的挑战

### 1. GitHub Actions 构建失败

最初的部署遇到了 `vue-router` 构建错误：

```bash
[vue-router] Could not load vue-router/auto-routes: 
seen.values(...).filter is not a function
```

**解决方案**：
- 将 Node.js 版本从 20 升级到 24
- 明确指定 `vue-router` 版本为 `5.0.3`
- 添加构建缓存和详细日志输出

### 2. 部署后页面 404

构建成功但 GitHub Pages 返回 404，检查发现 gh-pages 分支缺少 `index.html` 和 `assets` 文件夹。

**解决方案**：
- 使用 `peaceiris/actions-gh-pages@v4` 替代官方部署方案
- 添加构建验证步骤，确保 dist 目录生成正确
- 移除可能导致问题的 `force_orphan: true` 配置

### 3. 环境配置问题

本地构建正常，但 CI 环境构建失败。

**解决方案**：
- 在 workflow 中添加环境检查步骤
- 统一 Node.js 和 pnpm 版本
- 使用缓存加速依赖安装

## 最终的 GitHub Actions 配置

```yaml
name: Deploy to GitHub Pages

on:
  push:
    branches: [main]

jobs:
  deploy:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      - uses: pnpm/action-setup@v2
        with: { version: 8 }
      - uses: actions/setup-node@v4
        with: 
          node-version: 24
          cache: pnpm
      - run: pnpm install
      - run: |
          pnpm build
          if [ ! -f dist/index.html ]; then
            echo "ERROR: Build failed - index.html not found!"
            exit 1
          fi
      - uses: peaceiris/actions-gh-pages@v4
        with:
          github_token: ${{ secrets.GITHUB_TOKEN }}
          publish_dir: ./dist
```

## 博客功能特性

### 已实现的功能
- ✅ Markdown 写作支持
- ✅ 响应式设计，移动端友好
- ✅ RSS 订阅支持
- ✅ 代码高亮
- ✅ 标签和分类系统
- ✅ SEO 优化
- ✅ 评论系统（预留接口）

### 待完善的功能
- 🔄 搜索功能
- 🔄 暗色模式切换
- 🔄 文章阅读统计
- 🔄 图片懒加载优化

## 个人收获

1. **深入理解了 GitHub Actions 的工作流程**
2. **掌握了静态博客的部署和优化技巧**
3. **学习了 Valaxy 框架的配置和使用**
4. **增强了问题排查和解决能力**

## 给新手的建议

如果你也想搭建自己的技术博客，我建议：

1. **从简单开始** - 先确保基本功能可用，再逐步添加高级特性
2. **做好版本控制** - 每次修改都提交到 Git，方便回滚
3. **善用调试工具** - GitHub Actions 的日志非常重要
4. **参考官方文档** - Valaxy 和 GitHub Actions 的文档都很详细
5. **保持耐心** - 遇到问题不要慌张，一步步排查

## 结语

博客不只是技术的展示，更是思考和成长的记录。这个搭建过程让我深刻体会到：

> "The best way to learn is to do. The worst way to teach is to talk." - Paul Graham

期待在这个博客上记录更多的技术学习和思考。如果你也在搭建博客过程中遇到问题，欢迎在评论区交流讨论！

---

**相关链接**：
- [Valaxy 官方文档](https://valaxy.site/)
- [valaxy-theme-yun 主题](https://yun.yunyoujun.cn/)
- [GitHub Actions 文档](https://docs.github.com/actions)
- [我的博客源码](https://github.com/Caizhenxin/Caizhenxin.github.io)