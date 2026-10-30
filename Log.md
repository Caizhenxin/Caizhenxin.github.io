# Log · 版本更新日志

> 记录原则：新版本记录置于顶部，完整保留历史。版本号自 `v0.1` 起，每次对话更新递增 `0.1`。

## v0.6 · 2026-10-30

- **类型**：新增功能
- **负责人**：蔡振辛
- **更新内容**：
  - 首页同主题文章聚合：按 front-matter `series` 分组（≥2 篇），渲染为磨砂「专题卡」+ 悬停/聚焦展开的文集抽屉；
  - 交互：hover + 键盘 focus 展开、200ms 宽限收起、`Esc` 收起、触屏点击展开、`aria-expanded` 同步；
  - 视觉：半透明磨砂 + 细边框 + 低 alpha 柔光晕 + 条目左侧彩色指示条 + stagger 入场；暗色模式与 `prefers-reduced-motion` 适配；
  - 为「夜谈」三篇加入 `series: 夜谈`，首页合为 1 卡（按 04:03 → 08:30 → 09:40 排序）。
- **影响文件**：`themes/fluid/layout/index.ejs`、`themes/fluid/layout/_partials/topic-card.ejs`、`source/css/topic-card.css`、`source/js/topic-drawer.js`、`themes/fluid/_config.yml`、三篇文章 front-matter

## v0.5 · 2026-10-30

- **类型**：设计（未进入实现）
- **负责人**：蔡振辛
- **更新内容**：
  - 确定「同主题文章聚合」方向为 **方案 B · 磨砂浮层「文集抽屉」**；
  - 聚合判定采用 **显式 `series` 字段**（缺省不聚合，单篇不聚合）；
  - 产出设计规格 [`docs/superpowers/specs/2026-10-30-same-topic-glass-drawer-design.md`](docs/superpowers/specs/2026-10-30-same-topic-glass-drawer-design.md)。
- **影响文件**：新增设计文档（无代码改动）

## v0.4 · 2026-10-30

- **类型**：问题修复
- **负责人**：蔡振辛
- **更新内容**：
  - 修复悬停彩色纸飞机时“抽搐且无法开始游戏”的问题；
  - 根因为 CSS `:hover` 的 `transform: scale(...) !important` 覆盖了 JS 设置的 `translate()`，导致位置回跳形成抖动循环；
  - 改为由 JS 统一管理 `transform`（`translate + scale` 组合），CSS 仅保留 `hovered` 类控制发光。
- **影响文件**：`source/css/asteroids-game.css`、`source/js/asteroids-game.js`

## v0.3 · 2026-10-30

- **类型**：功能完善
- **负责人**：蔡振辛
- **更新内容**：
  - 将右下角「启动游戏」按钮改造为纸飞机形态的 Canvas 图标；
  - 鼠标悬停时以扇形展开 6 种颜色的纸飞机，点击任一彩色纸飞机即直接启动对应颜色游戏；
  - 移除原颜色选择模态（遮罩/弹窗/确认/取消），缩短交互路径。
- **影响文件**：`source/css/asteroids-game.css`、`source/js/asteroids-game.js`

## v0.2 · 2026-10-30

- **类型**：问题修复 / 交互优化
- **负责人**：蔡振辛
- **更新内容**：
  - 修复点击「开始游戏」偶发无响应：为启动链路加入 `try-catch` 与全流程 `console` 调试日志；
  - 颜色选择由网格模态改为纸飞机悬停展开交互。
- **影响文件**：`source/js/asteroids-game.js`

## v0.1 · 2026-10-30

- **类型**：新增功能
- **负责人**：蔡振辛
- **更新内容**：
  - 新增纸飞机小游戏「启动游戏」按钮与颜色选择模态；
  - 提供 6 种飞船颜色与 Canvas 预览、确认/取消操作及弹入弹出动效；
  - 游戏核心按所选颜色渲染飞船。
- **影响文件**：`source/css/asteroids-game.css`、`source/js/asteroids-game.js`、`themes/fluid/_config.yml`
