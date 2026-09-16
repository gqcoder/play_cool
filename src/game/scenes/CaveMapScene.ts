import Phaser from 'phaser'
import { SCENES } from '../utils/Constants'
import { Player } from '../objects/Player'
import { MagicCrystal } from '../objects/InteractiveObjects'

export class CaveMapScene extends Phaser.Scene {
  private player!: Player
  private crystal!: MagicCrystal

  constructor() {
    super({ key: SCENES.CAVE_MAP })
  }

  create(): void {
    const { width, height } = this.cameras.main

    // === 洞穴地面（深色岩石瓦片平铺） ===
    if (!this.textures.exists('cave_floor')) {
      const caveBg = this.textures.createCanvas('cave_floor', 16, 16)
      const ctx = caveBg?.getContext()
      if (ctx) {
        ctx.fillStyle = '#2a2a3e'
        ctx.fillRect(0, 0, 16, 16)
        for (let i = 0; i < 6; i++) {
          const x = Math.floor(Math.random() * 16)
          const y = Math.floor(Math.random() * 16)
          ctx.fillStyle = Math.random() > 0.5 ? '#1a1a2e' : '#3a3a4e'
          ctx.fillRect(x, y, Math.floor(Math.random() * 4) + 2, Math.floor(Math.random() * 4) + 2)
        }
        caveBg?.refresh()
      }
    }
    for (let y = 0; y < Math.ceil(height / 16); y++) {
      for (let x = 0; x < Math.ceil(width / 16); x++) {
        this.add.image(x * 16, y * 16, 'cave_floor').setOrigin(0)
      }
    }

    // === 石壁/岩石（立体感，阴影+高光） ===
    for (let i = 0; i < 12; i++) {
      const x = Phaser.Math.Between(50, width - 50)
      const y = Phaser.Math.Between(50, height - 50)
      const size = Phaser.Math.Between(24, 48)

      this.add.circle(x + 4, y + 4, size / 2, 0x0a0a1e, 0.5) // 阴影
      this.add.circle(x, y, size / 2, 0x4a5568) // 主体
      this.add.circle(x - size / 6, y - size / 6, size / 6, 0x6b7280) // 高光
    }

    // === 发光晶体点缀 ===
    for (let i = 0; i < 8; i++) {
      const x = Phaser.Math.Between(100, width - 100)
      const y = Phaser.Math.Between(100, height - 100)

      const glow = this.add.circle(x, y, 12, 0x6fb8ff, 0.3)
      this.add.circle(x, y, 6, 0x3b82f6)

      this.tweens.add({
        targets: glow,
        alpha: 0.6,
        duration: 1500,
        yoyo: true,
        repeat: -1,
        ease: 'Sine.easeInOut',
      })
    }

    // 创建玩家（从洞口进入，位置在底部）
    this.player = new Player(this, width / 2, height - 80)

    // 创建魔法水晶（中央位置）
    this.crystal = new MagicCrystal(this, width / 2, height / 2 - 40)
    this.crystal.setOnInteract(() => this.activateCrystal())

    // 设置点击移动
    this.input.on('pointerdown', (pointer: Phaser.Input.Pointer) => {
      this.player.moveTo(pointer.x, pointer.y)
    })

    // 返回按钮
    const backBtn = this.add.text(20, 20, '← 返回', {
      fontSize: '16px',
      color: '#ffffff',
      backgroundColor: '#000000aa',
      padding: { x: 10, y: 5 },
    })
    backBtn.setInteractive({ useHandCursor: true })
    backBtn.on('pointerdown', () => this.exitCave())

    // 场景淡入
    this.cameras.main.fadeIn(500, 0, 0, 0)

    // 环境提示
    const hint = this.add.text(width / 2, 30, '接近中央的魔法水晶', {
      fontSize: '16px',
      color: '#6ee7b7',
      backgroundColor: '#000000aa',
      padding: { x: 10, y: 5 },
    })
    hint.setOrigin(0.5)
    
    this.time.delayedCall(3000, () => {
      this.tweens.add({
        targets: hint,
        alpha: 0,
        duration: 500,
        onComplete: () => hint.destroy(),
      })
    })
  }

  update(): void {
    this.player.update()

    const pos = this.player.getPosition()
    this.crystal.checkPlayerDistance(pos.x, pos.y)
  }

  private activateCrystal(): void {
    // 播放激活效果
    const { width, height } = this.cameras.main

    // 屏幕闪光
    const flash = this.add.rectangle(0, 0, width, height, 0xffffff, 0)
    flash.setOrigin(0)
    flash.setDepth(100)

    this.tweens.add({
      targets: flash,
      alpha: 0.8,
      duration: 300,
      yoyo: true,
      onComplete: () => {
        flash.destroy()
        // 切换到内容播放场景
        this.scene.start(SCENES.CONTENT_VIEWER, {
          returnScene: SCENES.CAVE_MAP,
        })
      },
    })
  }

  private exitCave(): void {
    this.cameras.main.fadeOut(500, 0, 0, 0)
    this.time.delayedCall(500, () => {
      this.scene.start(SCENES.WORLD_MAP)
    })
  }
}
