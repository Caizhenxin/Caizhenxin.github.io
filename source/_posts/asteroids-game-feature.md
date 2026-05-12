---
title: "🎮 为博客添加网页破坏者小游戏"
date: 2026-05-12 10:00:00
tags:
  - 前端特效
  - 游戏开发
  - JavaScript
  - Hexo
categories:
  - 博客美化
---

## 功能介绍

在博客中集成了一个有趣的网页破坏者小游戏，灵感来源于 [Website Asteroids](http://www.websiteasteroids.com/)。现在访问我的博客，你可以控制一架小飞机在页面上飞行，发射子弹击毁网页上的各种元素！

## 游戏特性

### 🚀 核心玩法

- **飞船控制**：使用 WASD 或方向键控制飞船移动和转向
- **子弹射击**：空格键发射子弹
- **破坏元素**：子弹击中网页元素会将其移除并产生爆炸粒子效果
- **自动滚动**：飞船飞出屏幕边缘时会自动滚动页面

### ✨ 视觉效果

- 白色三角形飞船造型
- 推进时的红黄火焰特效
- 击中元素时的彩色粒子爆炸
- 黄色发光子弹
- 实时计分系统

### ⌨️ 操作指南

| 按键 | 功能 |
|------|------|
| `W` / `↑` | 前进（带火焰推进） |
| `A` / `←` | 左转 |
| `D` / `→` | 右转 |
| `Space` | 发射子弹 |
| `B` | 高亮显示可破坏元素 |
| `Esc` | 退出游戏 |

## 技术实现

### 核心技术栈

- **HTML5 Canvas**：渲染游戏画面
- **requestAnimationFrame**：流畅的60fps游戏循环
- **Vector 2D**：自定义向量运算库处理物理效果
- **DOM API**：通过 `elementFromPoint` 实现碰撞检测

### 关键实现

#### 1. 碰撞检测机制

```javascript
function getElementFromPoint(x, y) {
    // 临时隐藏游戏画布
    applyVisibility('hidden');
    // 获取点击位置的DOM元素
    var element = document.elementFromPoint(x, y);
    // 恢复画布可见性
    applyVisibility('visible');
    return element;
}
```

#### 2. 粒子爆炸效果

```javascript
function addParticles(startPos) {
    for (var i = 0; i < maxParticles; i++) {
        particles.push({
            dir: (new Vector(Math.random() * 20 - 10, 
                            Math.random() * 20 - 10)).normalize(),
            pos: startPos.cp(),
            cameAlive: Date.now()
        });
    }
}
```

#### 3. 物理运动系统

```javascript
// 加速度控制
if (keysPressed['up']) {
    vel.add(dir.mulNew(acc * tDelta));
} else {
    vel.mul(0.96); // 摩擦力
}

// 速度上限
if (vel.len() > maxSpeed) {
    vel.setLength(maxSpeed);
}
```

### 文件结构

```
source/
├── js/
│   └── asteroids-game.js    # 游戏核心逻辑
└── css/
    └── asteroids-game.css   # 样式文件
```

## 使用方法

游戏会在页面加载时自动启动，飞船默认出现在页面左上角。你可以：

1. 使用方向键或 WASD 控制飞船移动
2. 按空格键发射子弹击毁网页元素
3. 按 B 键高亮显示所有可破坏的元素
4. 按 Esc 键退出游戏

## 开发历程

### 源码获取

原始代码来自 [erkie/erkie.github.com](https://github.com/erkie/erkie.github.com)，我对其进行了现代化改造：

- 移除了 IE 浏览器兼容代码
- 使用 `requestAnimationFrame` 替代 `setTimeout`
- 简化了事件监听逻辑
- 添加了更好的错误处理

### 部署方式

在 Hexo 主题配置文件 `_config.yml` 中添加：

```yaml
custom_js:
  - /js/asteroids-game.js

custom_css:
  - /css/asteroids-game.css
```

## 结语

这个小游戏为博客增添了趣味性和互动性，希望大家玩得开心！如果你有任何建议或问题，欢迎在评论区留言。

---

*🎮 现在就试试吧！按 `W` 键起飞，`Space` 键发射子弹，看看你能击毁多少元素！*
