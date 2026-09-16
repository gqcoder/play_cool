import Phaser from 'phaser'
import { INTERACTIVE_OBJECTS, INTERACTION_DISTANCE } from '../utils/Constants'

export abstract class InteractiveObject {
  public sprite: Phaser.GameObjects.Container
  protected scene: Phaser.Scene
  protected hintText: Phaser.GameObjects.Text | null = null
  protected hintOffsetY: number = -60
  private onInteractCallback: (() => void) | null = null
  private isNear: boolean = false

  constructor(scene: Phaser.Scene, x: number, y: number) {
    this.scene = scene
    this.sprite = scene.add.container(x, y)
  }

  setOnInteract(callback: () => void): void {
    this.onInteractCallback = callback
  }

  /**
   * 开启物体自身的点击交互（需在子类添加完可视元素、确定尺寸后调用）
   * 只有玩家靠近时点击才会真正触发 interact()
   */
  protected enableClickInteraction(width: number, height: number): void {
    this.sprite.setSize(width, height)
    this.sprite.setInteractive({ useHandCursor: true })
    this.sprite.on('pointerdown', () => {
      if (this.isNear) {
        this.interact()
      }
    })
  }

  checkPlayerDistance(playerX: number, playerY: number): boolean {
    const distance = Phaser.Math.Distance.Between(
      this.sprite.x,
      this.sprite.y,
      playerX,
      playerY
    )
    
    const isNear = distance < INTERACTION_DISTANCE
    this.isNear = isNear

    if (isNear && !this.hintText) {
      this.showHint()
    } else if (!isNear && this.hintText) {
      this.hideHint()
    }

    return isNear
  }

  interact(): void {
    if (this.onInteractCallback) {
      this.onInteractCallback()
    }
  }

  protected showHint(): void {
    if (this.hintText) return
    
    this.hintText = this.scene.add.text(0, this.hintOffsetY, '点击交互', {
      fontSize: '16px',
      color: '#ffffff',
      backgroundColor: '#000000cc',
      padding: { x: 10, y: 6 },
    })
    this.hintText.setOrigin(0.5)
    this.sprite.add(this.hintText)
  }

  protected hideHint(): void {
    if (this.hintText) {
      this.hintText.destroy()
      this.hintText = null
    }
  }

  destroy(): void {
    this.hideHint()
    this.sprite.destroy()
  }
}

export class Signboard extends InteractiveObject {
  constructor(scene: Phaser.Scene, x: number, y: number) {
    super(scene, x, y)

    const config = INTERACTIVE_OBJECTS.SIGNBOARD
    const boardW = config.SIZE
    const boardH = config.SIZE * 0.7
    const postW = 6
    const postH = config.SIZE * 0.9

    // 木牌整体以底部（插入地面处）为容器原点对齐参考，
    // 木桩从 0（地面）向上延伸，木牌悬挂在木桩顶部

    // 木桩阴影（贴地椭圆，增强插入地面的立体感）
    const shadow = scene.add.ellipse(0, 2, boardW * 0.7, 8, 0x000000, 0.25)
    this.sprite.add(shadow)

    // 木桩（插入地面的竖直支柱，深棕色）
    const post = scene.add.rectangle(0, -postH / 2, postW, postH, 0x6b4226)
    post.setStrokeStyle(1, 0x4a2d18)
    this.sprite.add(post)

    // 木牌背板（浅木色，带深色边框模拟木纹边）
    const boardY = -postH - boardH / 2 + 6
    const board = scene.add.rectangle(0, boardY, boardW, boardH, 0xc98a4b)
    board.setStrokeStyle(3, 0x8b5a2b)
    this.sprite.add(board)

    // 木牌纹理横纹（模拟木板拼接缝）
    const plank1 = scene.add.rectangle(0, boardY - boardH / 4, boardW - 6, 1, 0x8b5a2b, 0.6)
    const plank2 = scene.add.rectangle(0, boardY + boardH / 4, boardW - 6, 1, 0x8b5a2b, 0.6)
    this.sprite.add(plank1)
    this.sprite.add(plank2)

    // 图钉/木钉细节（四角）
    const nailOffsetX = boardW / 2 - 5
    const nailOffsetY = boardH / 2 - 5
    const nailPositions = [
      { x: -nailOffsetX, y: boardY - nailOffsetY },
      { x: nailOffsetX, y: boardY - nailOffsetY },
      { x: -nailOffsetX, y: boardY + nailOffsetY },
      { x: nailOffsetX, y: boardY + nailOffsetY },
    ]
    nailPositions.forEach(p => {
      const nail = scene.add.circle(p.x, p.y, 1.5, 0x4a2d18)
      this.sprite.add(nail)
    })

    // 图标（告示内容示意）
    const icon = scene.add.text(0, boardY, '📋', { fontSize: '24px' })
    icon.setOrigin(0.5)
    this.sprite.add(icon)

    // 提示文字位置需在木牌上方（木牌整体已比原方案更高）
    this.hintOffsetY = boardY - boardH / 2 - 16

    // 开启点击交互（区域覆盖整根木桩和木牌）
    this.enableClickInteraction(boardW, postH + boardH)
  }
}

export class CaveEntrance extends InteractiveObject {
  constructor(scene: Phaser.Scene, x: number, y: number) {
    super(scene, x, y)

    const config = INTERACTIVE_OBJECTS.CAVE_ENTRANCE
    const isMobile = scene.cameras.main.width < 768
    
    // 响应式缩放
    const scale = isMobile ? 0.7 : 1
    const mountainW = config.SIZE * 2.6 * scale
    const mountainH = config.SIZE * 2.2 * scale
    const baseY = 0

    // 山体底部阴影
    const shadow = scene.add.ellipse(0, baseY + 6, mountainW * 0.85, 18, 0x000000, 0.25)
    this.sprite.add(shadow)

    // === 改进的山体：多层岩石，更自然 ===
    const stoneColors = [0x5b6472, 0x4a5361, 0x6b7684, 0x3f4650]
    
    // 底层大石块（山体基础）
    const baseLayers = [
      { dx: -mountainW * 0.35, dy: -8, rx: mountainW * 0.28, ry: mountainW * 0.2 },
      { dx: mountainW * 0.32, dy: -10, rx: mountainW * 0.26, ry: mountainW * 0.18 },
      { dx: 0, dy: -12, rx: mountainW * 0.24, ry: mountainW * 0.16 },
    ]
    baseLayers.forEach((layer, i) => {
      const color = stoneColors[i % stoneColors.length] as number
      const rock = scene.add.ellipse(layer.dx, baseY + layer.dy, layer.rx * 2, layer.ry * 2, color)
      rock.setStrokeStyle(2, 0x2a2f38)
      this.sprite.add(rock)
    })
    
    // 中层石块（山体中段）
    const midLayers = [
      { dx: -mountainW * 0.2, dy: -mountainH * 0.35, rx: mountainW * 0.22, ry: mountainW * 0.15 },
      { dx: mountainW * 0.18, dy: -mountainH * 0.38, rx: mountainW * 0.2, ry: mountainW * 0.14 },
      { dx: 0, dy: -mountainH * 0.55, rx: mountainW * 0.18, ry: mountainW * 0.12 },
    ]
    midLayers.forEach((layer, i) => {
      const color = stoneColors[(i + 1) % stoneColors.length] as number
      const rock = scene.add.ellipse(layer.dx, baseY + layer.dy, layer.rx * 2, layer.ry * 2, color)
      rock.setStrokeStyle(2, 0x2a2f38)
      this.sprite.add(rock)
    })
    
    // 顶层石块（山顶收尖）
    const topLayers = [
      { dx: -mountainW * 0.08, dy: -mountainH * 0.72, r: mountainW * 0.14 },
      { dx: mountainW * 0.06, dy: -mountainH * 0.75, r: mountainW * 0.12 },
      { dx: 0, dy: -mountainH * 0.88, r: mountainW * 0.1 },
    ]
    topLayers.forEach((layer, i) => {
      const color = stoneColors[(i + 2) % stoneColors.length] as number
      const rock = scene.add.circle(layer.dx, baseY + layer.dy, layer.r, color)
      rock.setStrokeStyle(2, 0x2a2f38)
      this.sprite.add(rock)
    })

    // 岩石高光（增加质感）
    for (let i = 0; i < 8; i++) {
      const hx = Phaser.Math.Between(-mountainW * 0.35, mountainW * 0.35)
      const hy = baseY - Phaser.Math.Between(10, mountainH * 0.85)
      const hr = Phaser.Math.Between(3, 6) * scale
      const highlight = scene.add.circle(hx, hy, hr, 0x8b95a3, 0.5)
      this.sprite.add(highlight)
    }

    // === 洞门（山体正面中下部） ===
    const doorW = config.SIZE * 0.75 * scale
    const doorH = config.SIZE * 0.85 * scale
    const doorY = baseY - doorH / 2 - 8

    // 洞门外框（石制门框）
    const doorFrame = scene.add.ellipse(0, doorY, doorW + 10, doorH + 8, 0x3a2e22)
    doorFrame.setStrokeStyle(3, 0x241b12)
    this.sprite.add(doorFrame)

    // 洞门主体（深黑）
    const door = scene.add.ellipse(0, doorY, doorW, doorH, 0x0a0a12)
    this.sprite.add(door)

    // 洞口微光
    const innerGlow = scene.add.ellipse(0, doorY + doorH * 0.15, doorW * 0.5, doorH * 0.35, 0x2a2440, 0.6)
    this.sprite.add(innerGlow)

    // 提示文字位置（山顶上方）
    this.hintOffsetY = -mountainH - 16

    // 开启点击交互
    this.enableClickInteraction(mountainW, mountainH)
  }
}

export class MagicCrystal extends InteractiveObject {
  constructor(scene: Phaser.Scene, x: number, y: number) {
    super(scene, x, y)

    const config = INTERACTIVE_OBJECTS.MAGIC_CRYSTAL
    
    // 发光效果
    const glow = scene.add.circle(0, 0, config.SIZE * 1.2, config.COLOR, 0.3)
    this.sprite.add(glow)

    // 水晶主体
    const crystal = scene.add.star(0, 0, 4, config.SIZE * 0.5, config.SIZE * 0.7, config.COLOR)
    crystal.setStrokeStyle(2, 0xffffff)
    this.sprite.add(crystal)

    // 脉动动画
    scene.tweens.add({
      targets: glow,
      scale: { from: 1, to: 1.4 },
      alpha: { from: 0.3, to: 0.6 },
      duration: 1500,
      yoyo: true,
      repeat: -1,
    })

    // 开启点击交互
    this.enableClickInteraction(config.SIZE * 1.4, config.SIZE * 1.4)
  }
}
