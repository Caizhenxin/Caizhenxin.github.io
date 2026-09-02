---
title: 给 DeepSeek Harness 装插件的排障全记录：pnpm、GitHub 网络与"版本线"
date: 2026-09-02 20:30:00
tags:
  - DSH
  - DeepSeek Harness
  - pnpm
  - 插件开发
  - 排障
categories:
  - 技术分享
---

# 🐛 给 DeepSeek Harness 装插件的排障全记录：pnpm、GitHub 网络与"版本线"

> 一条 `dsh plugin add` 命令，引出了一连串意料之外的坑：pnpm 的全量重解析、死活连不上的 GitHub、藏在 lockfile 里的玄机，以及"插件版本跟基础库版本对不上"这种最容易忽略的兼容性问题。这篇文章完整记录了我的排查过程与最终解法。

---

## 起因：我想装三个插件

最近在折腾 [DeepSeek Harness](https://github.com/deepseek-ai/dsh)（以下简称 DSH）的 Web GUI，想给它装几个社区插件：

1. [dshmarket](https://github.com/dsh-market/dsh-market) —— 可视化插件市场
2. [dsh-agent-teams](https://github.com/NanmiCoder/dsh-agent-teams) —— AgentTeams
3. [dsh-better-sidebar](https://github.com/omdsh-dev/DSH-better-sidebar) —— VSCode 风格侧边栏

DSH 官方提供了插件安装命令，看起来很简单：

```bash
dsh plugin --profile web add dshmarket
```

然而从第一条命令开始，我就掉进了排障的兔子洞。前两个插件最终顺利装上，第三个却让整个 Web GUI 每次启动都崩溃。这篇博客把我踩过的每一个坑、用过的每一个"偏方"都写出来，希望能帮你省下这些弯路。

---

## 第一幕：`pnpm add` 为什么要去连 GitHub？

### 症状

执行：

```bash
dsh plugin --profile web add dshmarket
```

输出：

```
EPERM: operation not permitted, open 'C:\Users\xxx\.dsh\profiles\web\_tmp_xxx'
```

（第一次是在沙箱环境里被文件权限拦住，放开后）变成：

```
ERROR Command failed with exit code 128:
git ls-remote git+ssh://git@github.com/Small-tailqwq/dsh-deep-whale.git HEAD HEAD^{}
ssh: Could not resolve hostname github.com: Name or service not known
```

我当时一脸懵：**我只是想加一个来自 npm 的包，为什么 pnpm 要去连 GitHub？** 更莫名其妙的是，报错的仓库 `Small-tailqwq/dsh-deep-whale` 跟我正要装的插件**毫无关系**。

### 破案：dsh plugin 到底是什么

先读 DSH 的源码（`lib/plugin-*.js`），真相大白：

> `dsh plugin --profile <name> <args>` 本质上是一个 **pnpm 转发器**：在 profile 目录里执行 `pnpm <args>`，装完后把"声明了 `dsh.bundle` 的已安装依赖"同步进 `package.json` 的 `dsh.profile.bundles` 层列表。

我的 web profile 位于 `C:\Users\xxx\.dsh\profiles\web`，里面有：

```jsonc
// package.json（节选）
"dependencies": {
  "@dsh-external/dsh-client-ui-skin-deep-whale-manager": "github:Small-tailqwq/dsh-deep-whale#path:/skin-manager",
  "@dsh-external/dsh-client-ui-skin-maid-atelier": "github:Small-tailqwq/dsh-deep-whale#path:/maid-atelier",
  "@dsh-external/dsh-client-ui-skin-orca-link": "github:Small-tailqwq/dsh-deep-whale#path:/orca-link",
  // ... 我之前装的皮肤主题插件，全是 GitHub 托管
}
```

关键机制在于：**`pnpm add` 会触发一次"非冻结"的完整依赖解析**，而不是只解析新加的包。也就是说，即使 lockfile 完好、旧依赖一个没动，pnpm 仍然会把 `package.json` 里所有依赖**重新过一遍 resolver**——其中就包括那三个 `github:` 直连的皮肤插件。解析它们需要 `git ls-remote` 访问 GitHub，而当时的环境里 **GitHub 完全不可达**：

| 目标 | 探测结果 |
|------|---------|
| `registry.npmmirror.com`（npm 镜像） | ✅ HTTP 200 |
| `registry.npmjs.org` | ✅ DNS 正常 |
| `github.com` | ❌ DNS `ENOTFOUND` |
| GitHub 官方 IP 直连（`curl --resolve`） | ❌ 全部 TCP 超时（exit 28） |

### 关键结论

- **`pnpm install --frozen-lockfile` 能跳过解析**（"Lockfile is up to date, resolution step is skipped"），全程不碰网络，对已有依赖零风险；
- 而 **`pnpm add` 一定会全量重解析**，环境里只要有任何一个 `github:` 依赖，且 GitHub 不可达，就必然失败——跟你装什么包无关。

所以那条命令失败不是"装不了新插件"，而是"旧依赖把整个解析拖下水了"。

---

## 第二幕：不碰 GitHub 的安装法 —— "lockfile 预置 + 冻结安装"

### 思路

既然 `pnpm add` 会因重解析而死，那就**绕开它**，让 pnpm 走"零解析"的冻结安装路径：

1. **先用 pnpm 生成"权威"的 lockfile 片段**：在一个临时工程里只声明新插件，跑一次 `pnpm install`（临时工程里没有 GitHub 依赖，镜像可达，能顺利解析），得到 pnpm 亲自写出来的、格式绝对正确的 lockfile 条目；
2. **把片段"并"进真实 profile 的 lockfile**：同时把依赖写进 `package.json`。此时 manifest 与 lockfile 完全一致；
3. **执行 `pnpm install --frozen-lockfile`**：解析被跳过 → 不会碰 GitHub 旧依赖 → 只从 npm 镜像拉取并安装新增的包；
4. **手动补上 `dsh plugin` 本来会自动做的 reconcile**：把新插件追加到 `dsh.profile.bundles`。

### 具体怎么做

临时工程：

```jsonc
// .dsh-tmp-seed/package.json
{ "dependencies": { "dsh-better-sidebar": "^0.17.1" } }
```

```bash
cd .dsh-tmp-seed && pnpm install   # 镜像可达，成功
```

它产出的 `pnpm-lock.yaml` 就是"标准答案"——包含 importer 条目、`packages:` 条目、`snapshots:` 条目，格式、缩进、排序、integrity 全部是 pnpm 亲自写的。

合并时我写了个小脚本做**文本级 block merge**：

- 以行首 `两个空格 + 非空格` 作为条目边界，把 `packages:` / `snapshots:` 切分成"条目块"；
- 用 js-yaml 解析两边做**重叠检测**（重复 key 必须内容一致，否则直接报错退出）；
- 把不重复的新条目块按 pnpm 的规范格式插进真实 lockfile；
- 最后再用 js-yaml 重新解析一次做**结构校验**（包数量 = 原有 + 新增、importer 依赖齐全）。

> ⚠️ **血的教训：永远不要手写 pnpm-lock.yaml**。它的条目（peerDependencies、peerDependenciesMeta、integrity、snapshots 的依赖锁定关系）环环相扣，差一个字符冻结校验就会失败。让 pnpm 自己生成、你再机械搬运，才是可靠做法。

然后更新 `package.json` 并执行：

```bash
pnpm install --frozen-lockfile --reporter=append-only
# => Lockfile is up to date, resolution step is skipped
# => Packages: +167  （better-sidebar 的子图有 167 个包）
```

最后把插件名追加进 `package.json` 的 `dsh.profile.bundles`（等效于 `dsh plugin` 的 reconcile 步骤）。

前两个插件（dshmarket、dsh-agent-teams）就这么顺利装上了。我甚至总结出了一套"离线安装 DSH 插件"的通用流程。

---

## 第三幕：装上了，但每次启动都崩

### 新症状

better-sidebar 装好（v0.17.1）之后，每次运行：

```bash
npx @deepseek-ai/dsh web
```

都在插件树加载阶段崩溃：

```
Error: dsh: plugin tree failed to load: failed to apply loader entry include (cordis:include):
failed to import loader entry better-sidebar (dsh-better-sidebar):
The requested module '@deepseek-ai/dsh-settings' does not provide an export named 'settingsNamespace'

import { SettingsConflictError, settingsNamespace } from "@deepseek-ai/dsh-settings";
                                                        ^^^^^^^^^^^^^^^^^
SyntaxError: The requested module '@deepseek-ai/dsh-settings' does not provide an export named 'settingsNamespace'
```

安装明明成功了，`node_modules` 里包也在，为什么一加载就报"模块没有这个导出"？

### 破案：两个"版本线"的错位

我做了三件事：

1. **找到基础库到底装在哪、是什么版本**。DSH 的 profile 有个共享基础层 `C:\Users\xxx\.dsh\profiles\node_modules\@deepseek-ai\`，插件 `import "@deepseek-ai/dsh-settings"` 在 Node 的模块解析里会向上逐级找到这一层。实测版本：**`dsh-settings@0.1.2-alpha.5`**；
2. **确认这个版本到底有没有 `settingsNamespace`**。grep 它的 `lib/index.js`：里面只有一个内部函数 `parseSettingsNamespace`，**并没有导出 `settingsNamespace`**；
3. **对比插件声明的基础版本**。看 npm 上 better-sidebar 各版本的 `peerDependencies`：

| better-sidebar 版本 | 要求的 `@deepseek-ai/dsh-settings` | 对应基础线 |
|---|---|---|
| ≤ 0.13.0 | `^0.1.0-rc.6` | 老 rc 线 |
| 0.13.1 | `^0.1.0-rc.7` | rc.7 线 |
| 0.14.0 ~ 0.17.1（latest） | `^0.1.0-rc.8` | **rc.8 线（有 `settingsNamespace`）** |
| **0.18.0-alpha.0（alpha）** | **`^0.1.2-alpha.2`** | **alpha 线（我装的基础就是它！）** |

真相是：**DSH 同时存在多条"版本线"**（rc.6 / rc.7 / rc.8 / alpha.2…），每条线的基础库 API 都不完全一样。npm 的 `latest` 标签并不代表"适合你的环境"——better-sidebar@0.17.1 是给 rc.8 基础线编译的，代码里直接 `import { settingsNamespace }`，而我的基础层是 alpha.5，API 没有这个名字，于是一 import 就炸。

### 修复

换成**同一版本线的配套版本**：`dsh-better-sidebar@0.18.0-alpha.0`（作者为 alpha 基础线发布的 alpha 版，peer 声明 `^0.1.2-alpha.2`，正好覆盖已装的 0.1.2-alpha.5）。

做法与第二幕相同，但这次更彻底——以"装 0.17.1 之前的 lockfile 备份"为基底重建 lockfile，再并入 alpha 版的子图：

```bash
pnpm install --frozen-lockfile   # 只 +1/-1：把 0.17.1 换成 0.18.0-alpha.0
```

### 验证（两个关键技巧）

**技巧一：写一个"复现 loader 解析路径"的 import 探针**

插件加载失败的本质是 ESM import 解析问题，那就在同样的解析位置直接 import 一次：

```js
// 放在 profiles/web/ 下
await import('dsh-better-sidebar');
console.log('IMPORT OK');
```

`node` 从这个文件出发向上找 `node_modules`，会命中基础层——与 cordis-plugin-loader 的实际解析路径一致。结果：

```
IMPORT OK: better-sidebar loads against base
```

**技巧二：真实启动，看到"端口占用"就算赢**

跑 `dsh --profile web`，如果插件树能加载，就会走到 webserver 监听那一步——而 3080 端口正被正在运行的 Web GUI 占着，于是：

```
failed to apply loader entry webserver (@deepseek-ai/dsh-host-webserver):
listen EADDRINUSE: address already in use 127.0.0.1:3080
```

**这个报错其实是好消息**：它证明插件树已经全部加载成功，只是第二个实例抢不到端口。跟之前"插件树加载阶段直接崩溃"完全是两回事。

---

## 经验清单

把这一路的收获浓缩成几条，下次能少走弯路：

1. **`dsh plugin` = 在 profile 目录里跑 pnpm**，装完还要把包同步进 `dsh.profile.bundles`（可以手动做等效操作）。
2. **`pnpm add` 会对整个依赖树做非冻结重解析**，环境中任何 `github:`/`git:` 依赖都可能成为拦路虎；而 **`--frozen-lockfile` 会完全跳过解析**——这是离线/受限网络环境下最可靠的安装路径。
3. **lockfile 别手写，要"搬运"**：用同版本 pnpm 在干净工程里生成权威条目，再以文本块粒度机械合并，配合 js-yaml 结构校验。
4. **npm 的 `latest` 不等于"适合你"**。DSH 生态同时存在多条版本线（rc.6/rc.7/rc.8/alpha…），选插件版本要看它的 `peerDependencies` 是否覆盖你基础层的实际版本——插件作者通常会给每条线发一个配套版本（看 `dist-tags` 的 `alpha`/`beta` 标签）。
5. **报错信息里藏着定位线索**：`does not provide an export named 'xxx'` = 代码是按另一个 API 版本编译的；先在 `lib/index.js` 里确认导出，再对比双方版本线。
6. **模块解析要看物理路径**：插件在 `profiles/web/node_modules`，`@deepseek-ai/*` 会向上解析到 `profiles/node_modules` 的基础层——探针放在同样的位置才能复现真实行为。

## 复盘：这条"心路历程"本身的价值

回头看，这个问题的本质是**两个环境约束叠加**：

- **网络约束**：GitHub 不可达、npm 镜像可达，导致"官方命令"这条路被旧依赖堵死；
- **版本约束**：插件与基础库不在同一条版本线，导致"装上了也跑不起来"。

单独看任何一个都不难，但它们组合在一起，就需要你同时理解 pnpm 的解析模型、DSH profile 的目录与分层机制、Node 的模块解析规则，以及 DSH 多版本线并行的发布策略——这也正是调试的乐趣所在：**每解开一层，你对整个系统的理解就更深一层。**

最后感谢 DSH 开源的代码与社区插件作者们，没有他们，就没有这篇踩坑记录 😄

---

*（文中路径做了脱敏处理，实际路径中的用户名请替换为你自己的）*
