---
title: 📖 新手必看：如何维护你的 Hexo 博客
date: 2026-04-04 12:00:00
tags:
  - 教程
  - Hexo
  - 博客维护
categories:
  - 技术分享
---

# 📖 新手必看：如何维护你的 Hexo 博客

恭喜你！你的个人博客已经成功搭建并部署到 GitHub Pages 上了。🎉

这篇文章将手把手教你日常如何维护博客，包括**写文章、换头像、改背景、修改导航菜单**等常用操作。不用担心，所有操作都很简单！

---

## 📁 博客项目结构速览

你的博客项目主要包含以下几个重要文件夹：

```
Caizhenxin.github.io/
├── _config.yml              # 🏠 博客主配置文件
├── source/                  # 📝 你的内容（文章、页面）
│   ├── _posts/              #    博客文章放这里
│   └── about/               #    关于页面
├── themes/
│   └── fluid/               # 🎨 Fluid 主题文件
│       └── _config.yml      #    主题配置文件
├── scaffolds/               # 📋 文章模板
└── public/                  # 📦 构建输出（自动生成，不用管）
```

> 💡 **记住两个最重要的文件**：
> - `_config.yml`（根目录）→ 博客的基本信息
> - `themes/fluid/_config.yml` → 主题的外观设置

---

## ✍️ 如何写新文章

### 方法一：手动创建（推荐新手）

1. 进入 `source/_posts/` 文件夹
2. 新建一个 `.md` 文件，比如 `my-first-post.md`
3. 在文件开头写上**文章信息**（Front Matter）：

```markdown
---
title: 我的第一篇文章
date: 2026-04-04 12:00:00
tags:
  - 随笔
  - 生活
categories:
  - 日常
---

# 这里是文章标题

今天天气真好，我来写第一篇博客！

## 小标题

这是正文内容...
```

4. 保存文件，提交并推送：

```bash
git add .
git commit -m "新增文章：我的第一篇文章"
git push origin main
```

### 方法二：使用 Hexo 命令

```bash
# 创建新文章（会自动生成 Front Matter）
npx hexo new post "文章标题"

# 编辑生成的文件
# 文件位置：source/_posts/文章标题.md
```

---

## 🖼️ 如何修改头像

### 步骤：

1. 准备一张你的头像图片（建议正方形，比如 `avatar.jpg`）
2. 将图片放到 `source/img/` 目录下（如果没有这个目录就新建一个）
3. 打开 `themes/fluid/_config.yml`
4. 搜索 `avatar`，修改为：

```yaml
webmaster:
  avatar: /img/avatar.jpg
  title: 游手好闲辛大人
  description: 热爱技术，热爱生活
```

5. 保存并提交推送即可。

> 💡 **提示**：图片路径以 `/` 开头表示从网站根目录开始。`/img/avatar.jpg` 对应 `source/img/avatar.jpg`。

---

## 🌄 如何修改首页背景图

Fluid 主题的首页背景图可以通过以下方式修改：

### 方法一：使用随机背景图（默认）

主题默认使用随机背景图，位于 `themes/fluid/source/img/random/` 目录下。

### 方法二：自定义背景图

1. 将你的背景图放到 `source/img/` 目录，比如 `banner.jpg`
2. 打开 `themes/fluid/_config.yml`
3. 搜索 `banner`，修改为：

```yaml
index:
  banner_img: /img/banner.jpg
  banner_img_height: 100
```

4. 保存并提交推送。

---

## 🎨 如何修改主题颜色

打开 `themes/fluid/_config.yml`，找到 `color` 部分：

```yaml
color:
  body_bg_color: "#eee"          # 网页背景色
  navbar_bg_color: "#2f4154"     # 导航栏背景色
  navbar_text_color: "#fff"      # 导航栏文字颜色
```

你可以修改这些颜色值。常用的颜色值：
- `#ffffff` → 白色
- `#000000` → 黑色
- `#333333` → 深灰色
- `#1890ff` → 蓝色
- `#52c41a` → 绿色

---

## 📌 如何修改导航菜单

打开 `themes/fluid/_config.yml`，找到 `nav` 部分：

```yaml
nav:
  - { key: "home", link: "/", icon: "iconfont icon-home-fill" }
  - { key: "archive", link: "/archives/", icon: "iconfont icon-archive-fill" }
  - { key: "category", link: "/categories/", icon: "iconfont icon-category-fill" }
  - { key: "tag", link: "/tags/", icon: "iconfont icon-tags-fill" }
  - { key: "about", link: "/about/", icon: "iconfont icon-user-fill" }
```

**添加新菜单项**：

```yaml
  - { key: "友情链接", link: "/links/", icon: "iconfont icon-link-fill" }
```

**删除菜单项**：直接删除对应的那一行即可。

---

## 🔗 如何添加社交链接

打开 `themes/fluid/_config.yml`，找到 `social` 部分：

```yaml
social:
  - { icon: "iconfont icon-github-fill", link: "https://github.com/Caizhenxin", tip: "GitHub" }
  - { icon: "iconfont icon-mail", link: "mailto:caizhenxin@example.com", tip: "邮箱" }
```

**添加新的社交链接**：

```yaml
  - { icon: "iconfont icon-wechat-fill", link: "javascript:;", tip: "微信" }
```

常用图标类名：
- `iconfont icon-github-fill` → GitHub
- `iconfont icon-mail` → 邮箱
- `iconfont icon-wechat-fill` → 微信
- `iconfont icon-weibo-fill` → 微博
- `iconfont icon-zhihu-fill` → 知乎

---

## 📝 如何修改关于页面

1. 打开 `source/about/index.md`
2. 直接编辑 Markdown内容
3. 保存并提交推送

```markdown
---
title: 关于我
date: 2026-04-04 12:00:00
type: about
layout: about
---

# 关于我

你好，我是 Cai Zhenxin！

这里可以写你的个人介绍、技能、经历等...
```

---

## 🚀 日常更新流程

每次修改后，只需要三步：

```bash
# 1. 添加所有更改
git add .

# 2. 提交更改（写清楚你改了什么）
git commit -m "修改了头像和背景图"

# 3. 推送到 GitHub（自动触发部署）
git push origin main
```

推送后，等待 **1-2 分钟**，GitHub Actions 会自动构建并部署你的博客。

---

## 🛠️ 本地预览（可选）

如果你想先在本地看看效果再推送：

```bash
# 安装依赖（第一次需要）
npm install

# 启动本地服务器
npm run dev

# 浏览器访问 http://localhost:4000
```

满意后再 `git add . && git commit -m "xxx" && git push origin main`

---

## ❓ 常见问题

### Q: 推送后网站没有更新？
A: 等待 1-2 分钟，GitHub Actions 需要时间构建。可以访问 https://github.com/Caizhenxin/Caizhenxin.github.io/actions 查看部署进度。

### Q: 图片不显示？
A: 检查图片路径是否正确。放在 `source/img/` 下的图片，访问路径是 `/img/文件名`。

### Q: 如何删除文章？
A: 直接删除 `source/_posts/` 下对应的 `.md` 文件，然后提交推送。

---

## 📚 进阶学习

- [Hexo 官方文档](https://hexo.io/zh-cn/docs/)
- [Fluid 主题文档](https://hexo.fluid-dev.com/docs/)
- [Markdown 语法教程](https://markdown.com.cn/)

---

> 💡 **小贴士**：每次修改前建议先 `git pull` 拉取最新代码，避免冲突。

祝你 blogging 愉快！🎉
