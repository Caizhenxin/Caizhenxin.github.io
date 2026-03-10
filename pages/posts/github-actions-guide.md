---
title: GitHub Actions 实战指南：自动化部署静态网站
date: 2026-03-08
tags:
  - GitHub Actions
  - CI/CD
  - 自动化部署
  - GitHub Pages
categories:
  - DevOps
---

# GitHub Actions 实战指南：自动化部署静态网站

在搭建个人博客的过程中，我深入使用了 GitHub Actions 进行自动化部署。这篇文章将分享我的实战经验，帮助你掌握 GitHub Actions 的核心概念和最佳实践。

## 什么是 GitHub Actions？

GitHub Actions 是 GitHub 提供的持续集成和持续部署 (CI/CD) 平台，允许你在代码仓库中自动化软件开发工作流程。

### 核心概念

- **Workflow（工作流程）**：自动化的流程，由 YAML 文件定义
- **Job（作业）**：工作流程中的任务单元，可以并行或顺序执行
- **Step（步骤）**：作业中的具体操作
- **Action（动作）**：可复用的代码单元
- **Runner（运行器）**：执行工作流程的服务器

## 为什么选择 GitHub Actions？

### 对比其他 CI/CD 工具

| 特性 | GitHub Actions | Travis CI | Jenkins |
|------|---------------|-----------|---------|
| 与 GitHub 集成 | ⭐⭐⭐⭐⭐ | ⭐⭐⭐⭐ | ⭐⭐ |
| 配置简单性 | ⭐⭐⭐⭐⭐ | ⭐⭐⭐⭐ | ⭐ |
| 免费额度 | 每月 2000 分钟 | 有限制 | 自托管免费 |
| 市场生态 | ⭐⭐⭐⭐⭐ | ⭐⭐⭐ | ⭐⭐ |
| 学习曲线 | 平缓 | 中等 | 陡峭 |

### GitHub Actions 的优势

1. **深度集成 GitHub** - 无缝触发，完美支持 pull requests、issues 等
2. **丰富的 Action 市场** - 数千个预构建的 Actions 可供使用
3. **免费额度充足** - 公开仓库完全免费，私有仓库也有免费额度
4. **配置即代码** - YAML 文件管理，版本控制友好
5. **强大的矩阵构建** - 支持多环境、多版本测试

## 实战：部署静态网站到 GitHub Pages

### 项目结构

```
.github/
└── workflows/
    └── deploy.yml     # GitHub Actions 配置文件
pages/
├── index.md          # 首页
├── about/
│   └── index.md     # 关于页面
└── posts/
    ├── hello-world.md
    └── blog-journey.md
```

### 完整的 Workflow 配置

```yaml
# .github/workflows/deploy.yml
name: Deploy to GitHub Pages

on:
  # 推送到 main 分支时触发
  push:
    branches: [main]
  
  # 允许手动触发
  workflow_dispatch:

# 设置 GITHUB_TOKEN 权限
percurrency:
  contents: write
  pages: write
  id-token: write

# 并发控制：防止多个部署同时运行
concurrency:
  group: pages
  cancel-in-progress: false

jobs:
  deploy:
    runs-on: ubuntu-latest
    
    steps:
      # 1. 检出代码
      - name: Checkout
        uses: actions/checkout@v4
        
      # 2. 设置 pnpm
      - name: Setup pnpm
        uses: pnpm/action-setup@v2
        with:
          version: 8
          
      # 3. 设置 Node.js 环境
      - name: Setup Node
        uses: actions/setup-node@v4
        with:
          node-version: 24
          cache: pnpm  # 启用 pnpm 缓存
          
      # 4. 环境检查
      - name: Check environment
        run: |
          echo "Node version: $(node --version)"
          echo "PNPM version: $(pnpm --version)"
          echo "NPM version: $(npm --version)"
          
      # 5. 安装依赖
      - name: Install dependencies
        run: pnpm install
        
      # 6. 构建项目
      - name: Build
        run: |
          pnpm build
          # 验证构建结果
          if [ ! -f dist/index.html ]; then
            echo "ERROR: Build failed - index.html not found!"
            exit 1
          fi
          echo "Build successful - found index.html"
        
      # 7. 调试：查看构建输出
      - name: Debug - List dist contents
        run: |
          echo "=== dist directory contents ==="
          ls -la dist/
          echo ""
          echo "=== assets directory contents ==="
          ls -la dist/assets/ || echo "No assets directory"
          echo ""
          echo "=== Total files in dist ==="
          find dist/ -type f | wc -l
          
      # 8. 部署到 GitHub Pages
      - name: Deploy
        uses: peaceiris/actions-gh-pages@v4
        with:
          github_token: ${{ secrets.GITHUB_TOKEN }}
          publish_dir: ./dist
```

## 关键配置详解

### 1. 触发条件 (on)

```yaml
on:
  # 推送到指定分支
  push:
    branches: [main, develop]
  
  # 定时触发（cron 表达式）
  schedule:
    - cron: '0 2 * * *'  # 每天 UTC 时间 2:00
  
  # 手动触发
  workflow_dispatch:
  
  # 仓库事件触发
  repository_dispatch:
    types: [deploy]
  
  # Pull Request 事件
  pull_request:
    branches: [main]
    types: [opened, synchronize, reopened]
```

### 2. 环境变量和 Secrets

```yaml
env:
  NODE_ENV: production
  BUILD_TIMESTAMP: ${{ github.run_number }}

jobs:
  deploy:
    runs-on: ubuntu-latest
    env:
      CUSTOM_ENV: value
    
    steps:
      - name: Use secrets
        run: |
          # 环境变量可以直接使用
          echo "Node env: $NODE_ENV"
          
          # Secrets 需要小心处理
          echo "Secret is set: ${{ secrets.MY_SECRET != '' }}"
          
          # 安全使用 secrets（避免日志输出）
          curl -H "Authorization: Bearer ${{ secrets.API_TOKEN }}" \
            https://api.example.com
```

### 3. 缓存优化

```yaml
steps:
  - uses: actions/checkout@v4
  
  - uses: pnpm/action-setup@v2
    with: { version: 8 }
  
  - uses: actions/setup-node@v4
    with:
      node-version: 24
      cache: pnpm  # 自动缓存 node_modules
  
  # 手动缓存
  - name: Cache dependencies
    uses: actions/cache@v3
    with:
      path: |
        **/node_modules
        **/.pnpm-store
      key: ${{ runner.os }}-pnpm-${{ hashFiles('**/pnpm-lock.yaml') }}
      restore-keys: |
        ${{ runner.os }}-pnpm-
```

## 常见问题与解决方案

### 问题 1：构建失败但日志不清楚

**症状**：工作流失败，但错误信息不明确。

**解决方案**：
```yaml
- name: Build with debug
  run: |
    # 启用详细日志
    set -x
    
    pnpm build || {
      echo "Build failed with exit code $?"
      echo "Checking dist directory..."
      ls -la dist/ || echo "No dist directory"
      exit 1
    }
```

### 问题 2：部署后 GitHub Pages 显示 404

**症状**：工作流成功，但网站无法访问。

**解决方案**：
```yaml
- name: Verify deployment
  run: |
    # 检查关键文件是否存在
    required_files=("index.html" "assets/index.js")
    for file in "${required_files[@]}"; do
      if [ ! -f "dist/$file" ]; then
        echo "ERROR: Missing required file: $file"
        exit 1
      fi
    done
    
    # 检查文件大小
    if [ $(stat -f%z dist/index.html) -lt 100 ]; then
      echo "ERROR: index.html is too small, likely empty"
      exit 1
    fi
```

### 问题 3：依赖安装缓慢

**症状**：每次运行都重新下载所有依赖。

**解决方案**：
```yaml
- name: Cache pnpm store
  uses: actions/cache@v3
  with:
    path: ~/.pnpm-store
    key: ${{ runner.os }}-pnpm-store-${{ hashFiles('pnpm-lock.yaml') }}
    restore-keys: |
      ${{ runner.os }}-pnpm-store-

- name: Install dependencies
  run: pnpm install --frozen-lockfile
```

## 高级技巧

### 1. 矩阵构建

```yaml
jobs:
  test:
    runs-on: ubuntu-latest
    strategy:
      matrix:
        node-version: [18, 20, 22]
        os: [ubuntu-latest, macos-latest, windows-latest]
    
    steps:
      - uses: actions/checkout@v4
      - uses: actions/setup-node@v4
        with:
          node-version: ${{ matrix.node-version }}
      
      - name: Test on ${{ matrix.os }} with Node ${{ matrix.node-version }}
        run: npm test
```

### 2. 条件执行

```yaml
steps:
  - name: Check if tests should run
    id: check
    run: |
      # 检查文件变化
      if git diff --name-only HEAD~1 HEAD | grep -q "\.js$"; then
        echo "should_run=true" >> $GITHUB_OUTPUT
      else
        echo "should_run=false" >> $GITHUB_OUTPUT
      fi
  
  - name: Run tests
    if: steps.check.outputs.should_run == 'true'
    run: npm test
  
  - name: Skip tests
    if: steps.check.outputs.should_run == 'false'
    run: echo "No JavaScript files changed, skipping tests"
```

### 3. 人工审批

```yaml
jobs:
  build:
    runs-on: ubuntu-latest
    steps:
      - run: echo "Building..."
  
  deploy:
    runs-on: ubuntu-latest
    needs: build
    # 需要人工审批
    if: github.event_name == 'workflow_dispatch'
    
    steps:
      - run: echo "Deploying..."
```

### 4. 部署到不同环境

```yaml
jobs:
  deploy:
    runs-on: ubuntu-latest
    environment: ${{ github.ref == 'refs/heads/main' && 'production' || 'staging' }}
    
    steps:
      - name: Deploy to ${{ github.ref == 'refs/heads/main' && 'Production' || 'Staging' }}
        run: |
          if [ "${{ github.ref }}" = "refs/heads/main" ]; then
            echo "Deploying to production..."
            # 生产环境部署逻辑
          else
            echo "Deploying to staging..."
            # 测试环境部署逻辑
          fi
```

## GitHub Actions 市场精选 Actions

### 部署相关
- **peaceiris/actions-gh-pages** - 部署到 GitHub Pages
- **JamesIves/github-pages-deploy-action** - 另一个部署选项
- **actions/deploy-pages** - GitHub 官方 Pages 部署

### 测试和质量
- **actions/setup-node** - 设置 Node.js 环境
- **cypress-io/github-action** - Cypress 测试
- **codecov/codecov-action** - 代码覆盖率

### 通知和沟通
- **actions/github-script** - 在 workflow 中执行 JavaScript
- **8398a7/action-slack** - 发送 Slack 通知
- **marocchino/sticky-pull-request-comment** - 创建 sticky PR 评论

### 安全和扫描
- **actions/checkout** - 安全地检出代码
- **ossf/scorecard-action** - 安全评分
- **github/codeql-action** - 代码安全扫描

## 性能优化建议

### 1. 减少运行时间
```yaml
# 使用更小的基础镜像
runs-on: ubuntu-22.04  # 而不是 ubuntu-latest

# 并行执行独立任务
jobs:
  lint:
    runs-on: ubuntu-latest
  test:
    runs-on: ubuntu-latest
  build:
    runs-on: ubuntu-latest
    needs: [lint, test]  # 等待前两个任务完成
```

### 2. 智能缓存
```yaml
# 分层缓存
- uses: actions/cache@v3
  with:
    path: ~/.npm
    key: ${{ runner.os }}-npm-${{ hashFiles('package-lock.json') }}
    restore-keys: |
      ${{ runner.os }}-npm-

- uses: actions/cache@v3
  with:
    path: ~/.cache
    key: ${{ runner.os }}-cache-${{ hashFiles('**/*.js') }}
```

### 3. 条件跳过
```yaml
# 根据提交信息跳过
- name: Skip if [skip ci]
  if: contains(github.event.head_commit.message, '[skip ci]')
  run: |
    echo "Skipping CI due to [skip ci] in commit message"
    exit 78  # 特殊退出码表示跳过

# 只对特定文件变化运行
- name: Run tests
  if: |
    always() && 
    github.event_name == 'push' &&
    !contains(github.event.head_commit.message, '[skip tests]')
```

## 监控和调试

### 1. 添加详细日志
```yaml
- name: Debug info
  run: |
    echo "GitHub context:"
    echo "Event: ${{ github.event_name }}"
    echo "Ref: ${{ github.ref }}"
    echo "SHA: ${{ github.sha }}"
    echo "Workflow: ${{ github.workflow }}"
    echo "Runner OS: ${{ runner.os }}"
    
    # 环境变量
    printenv | sort
```

### 2. 工作流状态通知
```yaml
- name: Notify on failure
  if: failure()
  uses: actions/github-script@v6
  with:
    script: |
      const { data: issue } = await github.rest.issues.create({
        owner: context.repo.owner,
        repo: context.repo.repo,
        title: `Workflow failed: ${context.workflow}`,
        body: `Workflow ${context.workflow} failed on ${context.ref}\n\nSee ${context.serverUrl}/${context.repo.owner}/${context.repo.repo}/actions/runs/${context.runId}`
      })
```

### 3. 性能监控
```yaml
- name: Measure performance
  run: |
    start_time=$(date +%s)
    
    # 你的构建命令
    npm run build
    
    end_time=$(date +%s)
    duration=$((end_time - start_time))
    
    echo "Build completed in ${duration} seconds"
    
    # 记录到文件
    echo "$(date),${duration},${GITHUB_RUN_ID}" >> build-times.csv
```

## 安全最佳实践

### 1. 保护敏感信息
```yaml
# 永远不要在日志中输出 secrets
- name: Unsafe (不要这样做)
  run: echo "Token is ${{ secrets.API_KEY }}"
  
- name: Safe approach
  run: |
    # 使用环境变量
    export API_KEY="${{ secrets.API_KEY }}"
    
    # 或者直接使用
    curl -H "Authorization: ${{ secrets.API_KEY }}" https://api.example.com
    
    # 清理环境变量
    unset API_KEY
```

### 2. 最小权限原则
```yaml
permissions:
  # 只授予必要的权限
  contents: read  # 而不是 write
  issues: write   # 如果需要创建 issue
  
  # 明确拒绝不需要的权限
  actions: none
  checks: none
  deployments: none
```

### 3. 依赖安全检查
```yaml
- name: Check for vulnerabilities
  uses: actions/dependency-review-action@v3
  with:
    fail-on-severity: high
  
- name: Audit dependencies
  run: npm audit --audit-level=high
```

## 实战案例：完整的博客部署流程

### 阶段 1：代码检查和测试
```yaml
lint-and-test:
  runs-on: ubuntu-latest
  steps:
    - uses: actions/checkout@v4
    - uses: actions/setup-node@v4
      with: { node-version: 24 }
    
    - name: Install dependencies
      run: npm ci
      
    - name: Lint
      run: npm run lint
      
    - name: Test
      run: npm test
      
    - name: Build
      run: npm run build
```

### 阶段 2：预览部署（Pull Request）
```yaml
preview:
  runs-on: ubuntu-latest
  if: github.event_name == 'pull_request'
  
  steps:
    - uses: actions/checkout@v4
    # ... 构建步骤
    
    - name: Deploy preview
      uses: JamesIves/github-pages-deploy-action@v4
      with:
        branch: gh-pages-preview
        folder: dist
        clean: true
```

### 阶段 3：生产部署（Main 分支）
```yaml
production:
  runs-on: ubuntu-latest
  if: github.ref == 'refs/heads/main'
  needs: lint-and-test
  
  steps:
    - uses: actions/checkout@v4
    # ... 构建步骤
    
    - name: Deploy to production
      uses: peaceiris/actions-gh-pages@v4
      with:
        github_token: ${{ secrets.GITHUB_TOKEN }}
        publish_dir: ./dist
        publish_branch: gh-pages
```

## 总结

GitHub Actions 是一个强大的自动化工具，通过本文的实战指南，你应该能够：

1. **理解核心概念** - Workflow、Job、Step、Action
2. **配置完整的工作流** - 从代码检查到生产部署
3. **解决常见问题** - 构建失败、部署错误、性能问题
4. **应用高级技巧** - 矩阵构建、条件执行、智能缓存
5. **遵循最佳实践** - 安全、性能、可维护性

> "Automation is not about replacing humans, it's about amplifying human potential." - Unknown

随着项目的成长，持续优化你的 CI/CD 流程，让自动化成为开发效率的倍增器。

---

**进一步学习**：
- [GitHub Actions 官方文档](https://docs.github.com/actions)
- [Awesome Actions](https://github.com/sdras/awesome-actions)
- [GitHub Skills: GitHub Actions](https://skills.github.com/)
- [GitHub Actions Workshop](https://github.com/actions/workshop)