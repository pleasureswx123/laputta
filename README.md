# 北京莱博塔传媒科技有限公司 官网

> 以国际之技，述中华之魂

北京莱博塔传媒科技有限公司官方网站，基于 **React 18 + Vite** 构建，融合电影级视觉设计与 Remotion 最佳实践动效。

---

## 技术栈

| 技术 | 版本 | 用途 |
|------|------|------|
| React | 18.x | UI 框架 |
| Vite | 6.x | 构建工具 |
| CSS Variables | — | 设计系统 / 主题 |

## 项目结构

```
lbt-web/
├── public/
│   ├── favicon.svg
│   └── logo.svg
├── src/
│   ├── assets/                 # 图片 & 视频素材
│   │   ├── bg_videos.mp4       # 英雄区全屏背景视频
│   │   ├── img_1.avif          # 关于我们 — 制作现场
│   │   ├── img_2.avif          # 业务范围 — 项目展示
│   │   └── img_3.avif          # 核心理念 — 创作理念
│   ├── components/
│   │   ├── Nav.jsx             # 导航（scroll + 移动端汉堡菜单）
│   │   ├── Hero.jsx            # 英雄区（全屏视频 + 粒子 + ScrambleText）
│   │   ├── About.jsx           # 关于我们
│   │   ├── Services.jsx        # 业务范围
│   │   ├── Philosophy.jsx      # 核心理念
│   │   ├── CompanyInfo.jsx     # 公司信息
│   │   ├── Footer.jsx          # 页脚
│   │   ├── ScrambleText.jsx    # 汉字乱码解码动效
│   │   ├── ScrollProgress.jsx  # 顶部滚动进度条
│   │   └── CursorGlow.jsx      # (备用) 弹簧光标
│   ├── hooks/
│   │   ├── useScrollReveal.js  # 滚动进入视图动效
│   │   ├── useStarCanvas.js    # Canvas 星空粒子动画
│   │   └── useCountUp.js       # 数字计数动效
│   ├── App.jsx
│   ├── main.jsx
│   └── index.css               # 全局设计系统样式
├── index.html
├── package.json
└── vite.config.js
```

## 动效特性（Remotion 最佳实践）

- **ScrambleText** — 中文字符逐字解码乱码 → 真实文字（`useCurrentFrame` 思路）
- **useCountUp** — `interpolate()` + ease-out cubic 数字弹射计数
- **ScrollProgress** — rAF 驱动的顶部金色进度条，零 React state 开销
- **星空 Canvas** — 粒子上升 + 随机流星彩蛋
- **视频背景** — `muted` + `loop` + `autoPlay` + `playsInline` 全屏静音自动播放
- **扫描线 & 胶片噪点** — CSS `@keyframes` 电影质感叠层
- **弹簧卡片 hover** — `cubic-bezier(0.34, 1.56, 0.64, 1)` 超调回弹

## 本地开发

```bash
# 安装依赖
npm install

# 启动开发服务器
npm run dev
# → http://localhost:5173

# 生产构建
npm run build

# 预览构建产物
npm run preview
```

## 页面结构

| 区块 | 说明 |
|------|------|
| **Hero** | 全屏视频背景 + 汉字乱码标题 + CountUp 数据统计 |
| **关于我们** | 公司介绍 + 实拍图 + 特性卡玻璃遮层 |
| **业务范围** | 项目展示横幅 + 六大业务卡片网格 |
| **核心理念** | 星空背景 + 四大支柱（两列） + 竖向创作图 |
| **公司信息** | 注册地址、成立日期、资本等六项 |
| **页脚** | Logo + 导航 + 联系信息 |

---

© 2024 北京莱博塔传媒科技有限公司
