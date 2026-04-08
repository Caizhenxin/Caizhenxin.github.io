---
title: 为 GitHub Readme 添加动态贪吃蛇效果——我的实践记录
date: 2026-04-07 10:00:00
tags:
  - GitHub
  - 自动化
  - 效果美化
  - 工作流
categories:
  - 技术分享
---

# 为 GitHub Readme 添加动态贪吃蛇效果——我的实践记录

> 看到很多大佬的 GitHub 首页都有炫酷的贪吃蛇代码贡献图，我也想给自己的 Readme 加上这个效果。这篇文章记录了我从零实现这一功能的全过程，包括遇到的问题和解决方案。

---

## 起因

在逛 GitHub 时，我注意到许多开发者的个人主页 Readme 都有一个动态的贪吃蛇图形，它根据 GitHub 贡献数据生成不同颜色的方块，形成一条"蛇"。这个效果不仅好看，还能直观展示代码贡献情况。

我心想：这也太酷了！必须要给自己的 Readme 加上这个效果。

于是我找到了两个关键资源：
1. [Platane/snk](https://github.com/Platane/snk) - 最早的贪吃蛇生成器
2. [denvercoder1/readme-typing-svg](https://github.com/denvercoder1/readme-typing-svg) - 另一个有趣的 Readme 效果（虽然我最终没用这个，但提供了思路）

## 实现过程

### 第一步：理解原理

贪吃蛇效果其实是通过 GitHub Actions 工作流定期生成 SVG 文件，然后在 Readme 中引用这些 SVG。核心步骤是：
1. 使用 Platane/snk action 根据 GitHub 贡献数据生成 SVG
2. 将生成的 SVG 发布到特定分支（通常是 `output` 分支）
3. 在 Readme 中通过正确的路径引用这些 SVG

### 第二步：创建工作流

我在仓库中创建了 `.github/workflows/snake.yml` 文件：

```yaml
name: GitHub Snk Readme Workflow

on:
  schedule:
    - cron: "0 0 * * *"
  workflow_dispatch:
  push:
    branches:
      - main

permissions:
  contents: write

jobs:
  generate:
    runs-on: ubuntu-latest
    timeout-minutes: 10

    steps:
      - name: 1. Checkout Repository
        uses: actions/checkout@v4

      - name: 2. Generate GitHub Contributions Snake Animations
        uses: Platane/snk/svg-only@v3
        with:
          github_user_name: ${{ github.repository_owner }}
          outputs: |
            github-snake.svg
            github-snake-dark.svg?palette=github-dark

      - name: 3. Deploy to Output Branch
        uses: peaceiris/actions-gh-pages@v4
        with:
          github_token: ${{ secrets.GITHUB_TOKEN }}
          publish_dir: ./
          publish_branch: output
          commit_message: "Update snake animation [skip ci]"
          allow_empty_commit: true
          force_orphan: true
```

### 第三步：遇到的问题和解决方案

#### 问题1：权限不足
最初运行工作流时，遇到了这样的错误：
```
remote: Permission to Caizhenxin/Caizhenxin.git denied to github-actions[bot].
fatal: unable to access 'https://github.com/Caizhenxin/Caizhenxin.git/': The requested URL returned error: 403
```

**解决方案**：在工作流中添加了 `permissions: contents: write` 来授予必要的写权限。

#### 问题2：文件路径不匹配
工作流成功运行后，我在 GitHub 上看不到贪吃蛇效果。检查发现：
- 工作流生成的 SVG 文件在 `output` 分支的根目录（如 `github-snake.svg`）
- 但我的 Readme 尝试从 `./assets/` 路径加载这些文件

**解决方案**： 
1. 修改工作流，直接在根目录生成 SVG（去掉 `assets/` 前缀）
2. 更新 Readme 使用可靠的 CDN 链接：
   ```html
   <!--Snake Code Contribution Map 贪吃蛇代码贡献图-->
   <picture>
     <source media="(prefers-color-scheme: dark)" srcset="https://cdn.jsdelivr.net/gh/Caizhenxin/Caizhenxin@output/github-snake-dark.svg" />
     <source media="(prefers-color-scheme: light)" srcset="https://cdn.jsdelivr.net/gh/Caizhenxin/Caizhenxin@output/github-snake.svg" />
     <img width="100%" alt="github-snake" src="https://cdn.jsdelivr.net/gh/Caizhenxin/Caizhenxin@output/github-snake.svg" />
   </picture>
   ```

使用 CDN 的好处是：
- 可以实时获取最新版本，避免缓存问题
- 加载速度快，有全球节点
- 不需要担心仓库内部路径问题

### 第四步：最终效果

完成以上步骤后，我的 GitHub 个人主页 Readme 就成功显示了动态贪吃蛇效果！🐍

效果展示：
- 每个方块代表一天，颜色深浅表示当天的贡献量（越深贡献越多）
- 暗色/亮色主题会根据访问者的系统偏好自动切换
- 工作流每天午夜自动更新，保持数据最新
- 同时支持手动触发（workflow_dispatch）和 push 触发

## 我的几点感受

### 1. 小问题要重视
开始时我只关注了生成 SVG，忽略了权限和路径问题。其实这些看似琐碎的配置往往是决定成败的关键。后来每遇到一个问题，我都会仔细阅读错误日志，而不是猜测。

### 2. 利用现成工具
与其自己从零实现一个贪吃蛇算法，不如直接使用成熟的 Platane/snk action。这不仅省时，还能确保效果专业可靠。在开发中，善用现有轮子往往比重复造轮子更明智。

### 3. CDN 是好帮手
对于需要频繁更新的静态资源（如每日更新的贡献图），使用 CDN 比直接引用仓库文件更可靠。它解决了缓存更新不及时的问题，确保访问者总能看到最新效果。

### 4. 迭代验证很重要
我没有一下子把所有配置都写好就提交，而是：
1. 先创建最基本的工作流
2. 触发运行看看是否能生成文件
3. 检查生成的文件位置和内容
4. 根据问题逐步修复配置
5. 最后添加 CDN 提高可靠性

这种小步快跑的方式比一次性解决所有问题更有效。

## 总结

为 GitHub Readme 添加贪吃蛇效果看起来是个小功能，但实际涉及工作流配置、权限管理、文件发布和资源引用等多个环节。通过这次实践，我不仅得到了一个炫酷的个人主页效果，还深入理解了 GitHub Actions 的工作机制。

如果你也想为自己的 Readme 添加类似效果，可以参考我的工作流配置。记住：
- 确保有足够的权限（`permissions: contents: write`）
- 注意文件生成和引用路径的一致性
- 考虑使用 CDN 提高可靠性
- 不要忘记测试验证每一步

现在，去给你的 Readme 也来条酷酷的贪吃蛇吧！🚀

---
> 本文记录了我为个人 GitHub Readme 添加动态贪吃蛇效果的完整过程。如果你有其他有趣的 Readme 美化想法，欢迎在评论区交流！