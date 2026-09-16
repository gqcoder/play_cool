import Phaser from 'phaser'
import { SCENES } from '../utils/Constants'

export class LoginScene extends Phaser.Scene {
  constructor() {
    super({ key: SCENES.LOGIN })
  }

  create(): void {
    const { width, height } = this.cameras.main

    // 背景
    this.add.rectangle(0, 0, width, height, 0x0a0d12).setOrigin(0)

    // 游戏标题
    const title = this.add.text(width / 2, height / 3, 'Play Cool', {
      fontSize: '48px',
      color: '#38bdf8',
      fontStyle: 'bold',
    })
    title.setOrigin(0.5)

    // 副标题
    const subtitle = this.add.text(width / 2, height / 3 + 60, 'Game 1: 魔法水晶的秘密', {
      fontSize: '20px',
      color: '#ffffff',
    })
    subtitle.setOrigin(0.5)

    // 开始按钮
    const startButton = this.add.text(width / 2, height / 2 + 80, '开始游戏', {
      fontSize: '24px',
      color: '#ffffff',
      backgroundColor: '#38bdf8',
      padding: { x: 30, y: 15 },
    })
    startButton.setOrigin(0.5)
    startButton.setInteractive({ useHandCursor: true })

    // 按钮悬停效果
    startButton.on('pointerover', () => {
      startButton.setScale(1.1)
    })
    startButton.on('pointerout', () => {
      startButton.setScale(1)
    })

    // 点击开始游戏
    startButton.on('pointerdown', () => {
      this.scene.start(SCENES.WORLD_MAP)
    })

    // 版本信息
    this.add.text(10, height - 30, 'v0.1.0 | 占位素材版本', {
      fontSize: '12px',
      color: '#666666',
    })
  }
}
