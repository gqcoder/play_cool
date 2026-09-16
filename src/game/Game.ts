import Phaser from 'phaser'
import { BootScene } from './scenes/BootScene'
import { LoginScene } from './scenes/LoginScene'
import { WorldMapScene } from './scenes/WorldMapScene'
import { CaveMapScene } from './scenes/CaveMapScene'
import { ContentViewerScene } from './scenes/ContentViewerScene'
import { PHYSICS_CONFIG } from './utils/Constants'

export function createGame(parent: string): Phaser.Game {
  const config: Phaser.Types.Core.GameConfig = {
    type: Phaser.AUTO,
    // RESIZE 模式下，初始宽高直接使用当前视口尺寸，
    // 后续窗口/屏幕变化时通过 main.ts 中的 resize 监听同步更新
    width: window.innerWidth,
    height: window.innerHeight,
    parent,
    backgroundColor: '#0a0d12',
    scale: {
      mode: Phaser.Scale.RESIZE, // 响应式缩放：画布尺寸始终等于视口尺寸，各场景按 this.cameras.main.width/height 动态布局
      autoCenter: Phaser.Scale.CENTER_BOTH,
    },
    physics: {
      default: 'arcade',
      arcade: {
        gravity: { x: 0, y: PHYSICS_CONFIG.GRAVITY },
        debug: PHYSICS_CONFIG.DEBUG,
      },
    },
    scene: [
      BootScene,
      LoginScene,
      WorldMapScene,
      CaveMapScene,
      ContentViewerScene,
    ],
    render: {
      pixelArt: true,
      antialias: false,
    },
  }

  return new Phaser.Game(config)
}
