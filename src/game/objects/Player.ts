import Phaser from 'phaser'
import { PLAYER_CONFIG } from '../utils/Constants'

export class Player {
  public sprite: Phaser.Physics.Arcade.Sprite
  private targetX: number | null = null
  private targetY: number | null = null
  private moveSpeed: number = PLAYER_CONFIG.SPEED
  private currentDirection: 'down' | 'up' | 'left' | 'right' = 'down'

  constructor(scene: Phaser.Scene, x: number, y: number) {
    // 使用预生成的精灵表（在 BootScene 中已生成）
    this.sprite = scene.physics.add.sprite(x, y, 'player_trump', 0)
    this.sprite.setCollideWorldBounds(true)
    
    // 调整碰撞体积（脚部区域）
    this.sprite.setSize(16, 12)
    this.sprite.setOffset(8, 36)
    
    // 播放默认待机动画
    this.sprite.play('idle_down')
    
    // 添加标签方便识别
    this.sprite.setData('type', 'player')

    // 整体放大显示（碰撞体积在放大前设置，避免被缩放影响判定范围）
    this.sprite.setScale(PLAYER_CONFIG.DISPLAY_SCALE)

    // 初始深度（后续在 update 中按 Y 坐标动态更新，实现与树木/石头的前后遮挡）
    this.sprite.setDepth(y)
  }

  moveTo(x: number, y: number): void {
    this.targetX = x
    this.targetY = y
  }

  stopMoving(): void {
    this.targetX = null
    this.targetY = null
    this.sprite.setVelocity(0, 0)
  }

  update(): void {
    // 按 Y 坐标动态更新深度，实现与树木/石头等场景装饰物的前后遮挡关系
    this.sprite.setDepth(this.sprite.y)

    if (this.targetX === null || this.targetY === null) {
      // 没有目标点，播放待机动画
      const idleAnim = `idle_${this.getDirectionKey()}`
      if (this.sprite.anims.currentAnim?.key !== idleAnim) {
        this.sprite.play(idleAnim)
      }
      return
    }

    const distance = Phaser.Math.Distance.Between(
      this.sprite.x,
      this.sprite.y,
      this.targetX,
      this.targetY
    )

    // 到达目标点，停止移动
    if (distance < 5) {
      this.stopMoving()
      return
    }

    // 计算移动方向
    const angle = Phaser.Math.Angle.Between(
      this.sprite.x,
      this.sprite.y,
      this.targetX,
      this.targetY
    )

    // 根据角度判断朝向（四方向）
    this.updateDirection(angle)

    // 设置速度
    this.sprite.setVelocity(
      Math.cos(angle) * this.moveSpeed,
      Math.sin(angle) * this.moveSpeed
    )

    // 播放对应行走动画
    const walkAnim = `walk_${this.getDirectionKey()}`
    if (this.sprite.anims.currentAnim?.key !== walkAnim) {
      this.sprite.play(walkAnim)
    }

    // 侧向行走时，根据方向翻转精灵
    if (this.currentDirection === 'left') {
      this.sprite.setFlipX(true)
    } else if (this.currentDirection === 'right') {
      this.sprite.setFlipX(false)
    }
  }

  /**
   * 根据移动角度更新角色朝向（四方向）
   */
  private updateDirection(angle: number): void {
    const deg = Phaser.Math.RadToDeg(angle)
    
    if (deg >= -45 && deg < 45) {
      this.currentDirection = 'right'
    } else if (deg >= 45 && deg < 135) {
      this.currentDirection = 'down'
    } else if (deg >= -135 && deg < -45) {
      this.currentDirection = 'up'
    } else {
      this.currentDirection = 'left'
    }
  }

  /**
   * 获取动画 key 的方向部分（侧向统一用 'side'）
   */
  private getDirectionKey(): string {
    if (this.currentDirection === 'left' || this.currentDirection === 'right') {
      return 'side'
    }
    return this.currentDirection
  }

  getPosition(): { x: number; y: number } {
    return { x: this.sprite.x, y: this.sprite.y }
  }

  destroy(): void {
    this.sprite.destroy()
  }
}
