# Game1 核心框架实现文档

## 概述

game1 是基于 Phaser 3 的移动端 2D 像素风格游戏，实现了完整的场景流程、玩家移动控制、交互系统和内容播放系统。当前版本使用程序生成的占位素材，后续可无缝替换为真实美术资源。

## 游戏流程

```
登录界面 (LoginScene)
    ↓ [点击开始游戏]
主世界地图 (WorldMapScene)
    ↓ [与告示牌交互：阅读提示]
    ↓ [移动到山洞入口]
    ↓ [进入山洞]
山洞地图 (CaveMapScene)
    ↓ [接近魔法水晶]
    ↓ [激活魔法水晶]
内容播放场景 (ContentViewerScene)
    ↓ [播放视频/图片/PPT等内容]
    ↓ [退出]
返回山洞 / 返回主世界
```

## 已实现功能

### 1. 场景系统

#### BootScene（启动场景）
- 资源加载（当前无外部资源，为占位素材预留）
- 自动跳转到登录界面

#### LoginScene（登录界面）
- 游戏标题展示
- 开始游戏按钮
- 按钮悬停效果
- 版本信息显示

#### WorldMapScene（主世界地图）
- 草地背景（绿色渐变 + 装饰树木）
- 玩家出生点：屏幕中下方
- 告示牌：左侧位置
- 山洞入口：右上方
- 点击移动控制（PC 鼠标/手机触屏）
- 对话框系统（告示牌交互）
- 场景切换效果（淡出 → 进入山洞）

#### CaveMapScene（山洞地图）
- 深色洞穴背景 + 石头装饰
- 魔法水晶：中央位置（带脉动发光动画）
- 返回主世界按钮
- 场景淡入/淡出效果
- 激活水晶 → 进入内容播放

#### ContentViewerScene（内容播放场景）
- 模拟投影幕布/电视机屏幕
- 支持图片轮播、视频、PPT（可配置）
- 左右切换按钮
- 进度指示
- 说明文字显示
- 退出按钮 → 返回山洞

### 2. 玩家系统（Player）

**特性：**
- 点击目标位置自动寻路移动
- 物理引擎支持（Arcade Physics）
- 世界边界碰撞检测
- 自动停止（到达目标点）

**控制方式：**
- PC：鼠标点击地面
- 移动端：触屏点击地面

**占位素材：**
- 蓝色方块（32x32px）

### 3. 交互系统（InteractiveObjects）

#### 基类 InteractiveObject
- 玩家距离检测（< 60px 显示交互提示）
- 交互回调机制
- 提示文字自动显示/隐藏

#### Signboard（告示牌）
- 橙色方形占位 + 📋 图标
- 交互：显示对话框（任务提示）

#### CaveEntrance（山洞入口）
- 深色椭圆占位 + 🕳️ 图标
- 交互：切换到山洞场景

#### MagicCrystal（魔法水晶）
- 绿色星形 + 发光脉动效果
- 交互：屏幕闪光 → 进入内容播放

### 4. 内容播放系统

**配置文件：** `src/game/content/ContentConfig.ts`

**支持类型：**
- `image`: 图片轮播（自动切换）
- `video`: 视频播放（待接入 `<video>` 标签）
- `ppt`: 图片序列（手动点击翻页）

**当前占位内容：**
- 4 张彩色背景 + 序号 + 说明文字
- 3 秒自动切换（image 类型）
- 左右箭头手动切换

**接入真实内容方式：**

```typescript
// 在 ContentConfig.ts 中配置
export const MY_PLAYLIST: ContentPlaylist = {
  id: 'my-content',
  title: '自定义内容标题',
  items: [
    {
      type: 'image',
      src: '/assets/content/slide1.jpg', // 放入 public/assets/content/
      duration: 4000,
      caption: '第一页说明',
    },
    {
      type: 'video',
      src: '/assets/content/intro.mp4',
      caption: '开场视频',
    },
    // ... 更多内容
  ],
}
```

然后在 `ContentViewerScene.ts` 中替换 `PLACEHOLDER_PLAYLIST` 为 `MY_PLAYLIST`。

## 技术架构

### 物理引擎
- Phaser Arcade Physics
- 重力：0（俯视角游戏）
- 调试模式：开启（便于开发）

### 分辨率
- 游戏画布：800x600
- 自适应缩放：Phaser.Scale.FIT
- 自动居中：CENTER_BOTH

### 素材管理

**当前状态：**
所有素材通过 `Phaser.GameObjects.Graphics` 在运行时生成（占位用）。

**美术接入方式：**
1. 将素材文件放入 `assets/` 目录
2. 在 `BootScene.preload()` 中加载：
   ```typescript
   this.load.image('player', '/assets/sprites/characters/player.png')
   ```
3. 在对应对象中替换占位图形：
   ```typescript
   // 原：graphics.generateTexture('player_placeholder', ...)
   // 改为：
   this.sprite = scene.physics.add.sprite(x, y, 'player')
   ```

## 后续扩展方向

### 1. 同基础框架扩展（game2, game3）

**可复用部分：**
- 玩家移动系统（Player 类）
- 交互系统（InteractiveObject 基类）
- 内容播放系统（ContentViewerScene）
- 场景管理流程

**扩展方式：**
- 创建新的场景类（继承 `Phaser.Scene`）
- 自定义交互对象（继承 `InteractiveObject`）
- 配置新的内容播放列表（`ContentPlaylist`）
- 在 `Game.ts` 中注册新场景

### 2. 美术素材接入

**玩家角色：**
- 建议规格：32x32px sprite sheet
- 支持 4 方向行走动画（上下左右）
- 格式：PNG（透明背景）

**地图素材：**
- 方式1：使用 Tiled 编辑器绘制 tilemap
- 方式2：导出整张地图 PNG 作为背景图
- 碰撞层：在 Phaser 中配置 collision layer

**交互对象：**
- 告示牌：48x72px
- 山洞入口：64x48px
- 魔法水晶：40x40px（建议有动画帧）

### 3. 内容播放增强

**视频播放：**
在 `ContentViewerScene` 中添加 `<video>` 标签支持：
```typescript
const videoElement = this.add.video(x, y, 'video-key')
videoElement.play()
```

**外部数据源：**
从服务器/CMS 动态加载内容列表：
```typescript
fetch('/api/content/playlist')
  .then(res => res.json())
  .then(data => this.loadPlaylist(data))
```

### 4. 移动端优化

- 虚拟摇杆（替代点击移动）
- 触摸手势（双指缩放地图）
- 横竖屏适配
- 性能优化（降低粒子效果复杂度）

### 5. 存档系统

- LocalStorage 保存玩家进度
- 场景状态记录（已读对话、已开启门等）
- 云存档（可选）

## 测试方法

### 本地测试
```bash
npm run dev
```
访问 http://localhost:5174

### 手机测试
1. 确保手机和电脑在同一 Wi-Fi
2. 手机浏览器访问：http://192.168.1.30:5174
3. 测试触屏点击移动

### 检查清单
- [ ] 登录界面 → 开始游戏按钮正常
- [ ] 主世界地图：点击移动玩家
- [ ] 接近告示牌显示提示 → 点击查看对话
- [ ] 接近山洞入口 → 点击进入山洞
- [ ] 山洞场景：接近魔法水晶
- [ ] 点击魔法水晶 → 屏幕闪光 → 进入内容播放
- [ ] 内容播放：左右切换按钮正常
- [ ] 退出内容播放 → 返回山洞
- [ ] 山洞 → 返回主世界

## 文件结构总览

```
src/game/
├── Game.ts                          # 主配置（注册所有场景）
├── objects/
│   ├── Player.ts                    # 玩家对象（移动控制）
│   └── InteractiveObjects.ts        # 交互对象（告示牌/山洞/水晶）
├── scenes/
│   ├── BootScene.ts                 # 启动场景
│   ├── LoginScene.ts                # 登录界面
│   ├── WorldMapScene.ts             # 主世界地图
│   ├── CaveMapScene.ts              # 山洞地图
│   └── ContentViewerScene.ts        # 内容播放场景
├── content/
│   └── ContentConfig.ts             # 内容播放配置（视频/图片/PPT）
└── utils/
    └── Constants.ts                 # 全局常量配置
```

## 开发者备注

- 物理引擎调试已开启：`PHYSICS_CONFIG.DEBUG = true`（生产环境改为 `false`）
- 所有交互距离统一为 60px（`INTERACTION_DISTANCE`）
- 场景切换使用 `fadeOut(500) + fadeIn(500)` 效果
- 占位素材颜色方案：
  - 玩家：蓝色 `0x38bdf8`
  - 告示牌：橙色 `0xe9a568`
  - 山洞：深灰 `0x1e2636`
  - 魔法水晶：绿色 `0x6ee7b7`

## 已知限制（待解决）

1. **视频播放未实现**：当前 `type: 'video'` 只显示占位画面
2. **移动路径寻路**：直线移动，未实现 A* 寻路（可能卡墙角）
3. **动画系统**：玩家/NPC 无行走动画（等待美术素材）
4. **音效系统**：未实现背景音乐和音效
5. **地图碰撞**：无 tilemap 碰撞检测（当前只有世界边界）

## 更新日志

### v0.1.0 - 2026-09-16
- ✅ 实现完整 game1 流程
- ✅ 玩家移动系统（点击移动）
- ✅ 交互系统（告示牌/山洞/水晶）
- ✅ 内容播放系统（占位版本）
- ✅ 5 个场景（Boot/Login/World/Cave/ContentViewer）
- ✅ TypeScript 类型检查通过
- ✅ 移动端触屏支持
