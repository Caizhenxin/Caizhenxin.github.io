---
title: 🎨 为你的 Hexo Fluid 博客添加可爱桌宠特效
date: 2026-04-11 12:00:00
tags:
  - 教程
  - Hexo
  - Fluid主题
  - 桌宠
  - 前端特效
categories:
  - 博客美化
---

> 参考来源：[使用CSS3动画制作页面底部走动的桌宠](https://saber.love/%e4%bd%bf%e7%94%a8css3%e5%8a%a8%e7%94%ba%e5%88%b6%e4%bd%9c%e7%bd%91%e9%a1%b5%e5%ba%95%e9%83%a8%e8%b5%b0%e5%8a%a8%e7%9a%84%e6%a1%8c%e5%ae%a0.html)

想让你的博客更有生机吗？添加一个可爱的桌宠（Desktop Pet）特效是个不错的选择！本教程将手把手教你如何在 Hexo Fluid 主题中添加一个可以在页面底部左右走动的桌宠。

## 🎯 效果预览

添加成功后，你会看到一个可爱的小角色在你的博客页面底部来回走动，为访客增添乐趣。

## 📋 前置条件

1. 你的博客基于 Hexo + Fluid 主题
2. 已经准备好一个你喜欢的桌宠GIF图片（建议使用透明背景的GIF）

## 🛠️ 实现步骤

### 步骤1：准备桌宠图片

1. 选择或制作一个你喜欢的桌宠GIF图片
2. 将图片命名为 `zc.gif`（或其他名称，但需与后续代码匹配）
3. 将图片放置到博客的 `source/images/` 目录下
   - 完整路径：`source/images/zc.gif`

> 💡 **提示**：图片路径以 `/` 开头表示从网站根目录开始。`/images/zc.gif` 对应 `source/images/zc.gif`。

### 步骤2：修改主题配置

1. 打开 Fluid 主题配置文件：`themes/fluid/_config.yml`
2. 滚动到文件最末尾（或找到合适位置添加）
3. 添加以下配置内容：

```yaml
# 自定义 HTML 内容 - 桌宠
# Custom HTML content - Desktop pet
custom_html: |
  <!-- 底部走动的桌宠 -->
  <img id="zhuochong" src="/images/zc.gif">
  <style>
      #zhuochong{position: fixed;z-index: 999999;bottom:0;left:-100px;opacity: 0.9;transform:scaleX(-1);animation-direction: alternate;animation-timing-function: linear;}
  </style>
  <style id="zcCss"></style>
  <script type="text/javascript">
      (function () {
          var zc,zcCss,w1,w2,leftStart,leftEnd,speed,time,fx,isfirst;
          document.addEventListener("DOMContentLoaded", function () {
              zc=document.querySelector("#zhuochong"),
              zcCss=document.querySelector("#zcCss"),
              w1=document.body.scrollWidth,
              w2=86,
              leftStart=0-w2,
              leftEnd=w1-w2,
              speed=100,
              time=parseInt(w1/speed),
              fx="r",
              isfirst=true;
              zcmove(fx);
              zc.addEventListener("animationend", function () {
                  isfirst=false;
                  fx==="r"?fx="l":fx="r";
                  zcmove(fx);
              });
          });
   
          function zcmove(fx) {
              if (!isfirst) {
                  leftStart=0;
              }
              if (fx==="r") {
                  zc.style.transform="scaleX(-1)";
                  zcCss.innerHTML='@keyframes zcmove{' +
                                      'from {left: '+leftStart+'px}' +
                                      'to {left: '+leftEnd+'px}' +
                                  '}';
                  zc.style.animationName="zcmove";
                  zc.style.animationDuration=time+"s";
              }else if (fx==="l") {
                  zc.style.transform="scaleX(1)";
                  zcCss.innerHTML='@keyframes zcmove2{' +
                                      'from {left: '+leftEnd+'px}' +
                                      'to {left: '+leftStart+'px}' +
                                  '}';
                  zc.style.animationName="zcmove2";
                  zc.style.animationDuration=time+"s";
              }
          }
      })();
  </script>
```

### 步骤3：调整参数（可选）

根据你的实际情况，可能需要调整以下参数：

- `w2=86`：桌宠图片的实际宽度（像素），根据你的GIF图片宽度修改
- `speed=100`：移动速度（像素/秒），数值越大越快
- `opacity: 0.9`：透明度（0-1之间），调整为1则完全不透明
- `z-index: 999999`：层级，通常无需修改，确保在最上层

### 步骤4：生成并部署

保存配置文件后，执行以下命令：

```bash
# 1. 清除缓存
npx hexo clean

# 2. 重新生成静态文件
npx hexo generate

# 3. 本地预览（可选）
npx hexo server

# 访问 http://localhost:4000 查看效果
```

满意后推送到GitHub：

```bash
git add .
git commit -m "添加桌宠特效"
git push origin main
```

推送后，GitHub Actions会自动构建并部署你的博客（约1-2分钟）。

## ⚙️ 技术原理简述

这个特效主要使用了以下前端技术：

1. **CSS定位**：使用 `position: fixed` 将元素固定在视口底部
2. **CSS动画**：通过 `@keyframes` 定义从左到右和从右到左的移动动画
3. **JavaScript控制**：
   - 监听 `DOMContentLoaded` 事件确保DOM已加载
   - 计算页面宽度和动画时长
   - 动态生成两个关键帧动画（向左和向右）
   - 监听 `animationend` 事件实现无缝循环
   - 使用 `transform:scaleX()` 实现图像水平翻转，使桌宠始终面向移动方向

## 🔍 故障排除

如果桌宠没有显示或无法移动，请检查：

1. **图片路径是否正确**：确认 `source/images/zc.gif` 文件存在
2. **浏览器控制台**：按 F12 检查是否有JavaScript错误
3. **配置缩进**：YAML对缩进非常敏感，确保 `custom_html:` 前没有多余空格
4. **清除缓存**：有时需要强制刷新浏览器（Ctrl+Shift+R/Cmd+Shift+R）

## 🎨 自定义建议

- 尝试不同的桌宠图片：猫咪、小动物、卡通角色等都很可爱
- 调整出现时间：可以添加延迟或滚动触发条件
- 添加点击交互：让桌宠被点击时做出特殊动作
- 多桌宠：通过修改代码可以实现多个桌宠同时出现

## 📚 参考资料

本特效实现参考自：[使用CSS3动画制作页面底部走动的桌宠](https://saber.love/%e4%bd%bf%e7%94%a8css3%e5%8a%a8%e7%94%ba%e5%88%b6%e4%bd%9c%e7%bd%91%e9%a1%b5%e5%ba%95%e9%83%a8%e8%b5%b0%e5%8a%a8%e7%9a%84%e6%a1%8c%e5%ae%a0.html)

原作者使用了类似的CSS3动画和JavaScript实现，我将其适配到了Hexo Fluid主题的配置系统中。

---

> 💡 **小贴士**：每次修改主题配置后，记得执行 `npx hexo clean && npx hexo generate` 以确保更改生效。
> 
> 现在，去为你的博客增添一点可爱吧！🐾