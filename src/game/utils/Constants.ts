// 响应式游戏尺寸（已废弃固定值，改用 RESIZE 模式动态适配）
// 各场景通过 this.cameras.main.width/height 获取实时视口尺寸进行布局
export const GAME_CONFIG = {
  PIXEL_SCALE: 2,
  TARGET_FPS: 60,
} as const

export const PHYSICS_CONFIG = {
  GRAVITY: 0,
  DEBUG: false, // 关闭调试框，避免脚下出现红框和速度引导线
} as const

export const PLAYER_CONFIG = {
  SPEED: 150,
  SIZE: 256,            // 巫师角色原始帧宽度
  COLOR: 0x38bdf8,     // 蓝色占位
  DISPLAY_SCALE: 0.25, // 256x320 素材按 4x 像素密度显示为约 64x80
} as const

export const INTERACTIVE_OBJECTS = {
  SIGNBOARD: {
    COLOR: 0xe9a568, // 橙色告示牌
    SIZE: 48,
  },
  CAVE_ENTRANCE: {
    COLOR: 0x1e2636, // 深色洞口
    SIZE: 64,
  },
  MAGIC_CRYSTAL: {
    COLOR: 0x6ee7b7, // 绿色水晶
    SIZE: 40,
  },
} as const

export const SCENES = {
  BOOT: 'BootScene',
  LOGIN: 'LoginScene',
  WORLD_MAP: 'WorldMapScene',
  CAVE_MAP: 'CaveMapScene',
  CONTENT_VIEWER: 'ContentViewerScene',
} as const

export const INTERACTION_DISTANCE = 60 // 交互距离
