# Play Cool

一个移动端优先的 2D Pixel Art H5 小游戏，使用 Phaser 3 构建。

## 技术栈

- **游戏引擎**: Phaser 3
- **构建工具**: Vite
- **语言**: TypeScript
- **PWA**: Service Worker + Workbox
- **地图编辑**: Tiled
- **美术制作**: Aseprite (可选)

## 开发环境

- Node.js: v24.14.1
- npm: 11.11.0
- macOS (Apple Silicon)

## 快速开始

### 安装依赖

```bash
npm install
```

### 开发模式

```bash
npm run dev
```

访问 http://localhost:5173

### 手机局域网测试

```bash
npm run dev
```

使用本机 IP 访问，例如：http://192.168.x.x:5173

### 生产构建

```bash
npm run build
```

输出到 `dist/` 目录。

### 预览生产构建

```bash
npm run preview
```

## 项目结构

```
play_cool/
├── src/
│   ├── game/           # 游戏核心代码
│   │   ├── scenes/     # 游戏场景
│   │   ├── objects/    # 游戏对象
│   │   ├── physics/    # 物理系统
│   │   ├── input/      # 输入管理
│   │   └── utils/      # 工具函数
│   ├── styles/         # 全局样式
│   └── main.ts         # 应用入口
├── assets/             # 游戏资源
│   ├── sprites/        # 精灵图
│   ├── maps/           # 地图文件
│   └── audio/          # 音频文件
└── public/             # 静态资源

```

## 开发流程

1. ✅ 环境检查和项目初始化
2. ⬜ Player 移动和输入管理
3. ⬜ 地图和碰撞系统
4. ⬜ 手机触摸控制
5. ⬜ Tiled 地图集成
6. ⬜ 动画系统
7. ⬜ NPC 和对话
8. ⬜ 音效集成
9. ⬜ PWA 离线缓存优化
10. ⬜ 部署到 GitHub Pages

## 性能目标

- 首次加载: < 3s
- 运行帧率: 60 FPS (移动端 30 FPS)
- 资源体积: 单个精灵图 < 500KB

## License

MIT
