import Phaser from 'phaser'
import { SCENES } from '../utils/Constants'
import { Player } from '../objects/Player'
import { Signboard, CaveEntrance } from '../objects/InteractiveObjects'

export class WorldMapScene extends Phaser.Scene {
  private player!: Player
  private signboard!: Signboard
  private caveEntrance!: CaveEntrance
  private dialogBox: Phaser.GameObjects.Container | null = null
  private obstacleGroup!: Phaser.Physics.Arcade.StaticGroup

  constructor() {
    super({ key: SCENES.WORLD_MAP })
  }

  create(): void {
    const { width, height } = this.cameras.main

    // === 地面背景（草地瓦片平铺，Puny World 素材，多种草纹随机混合避免重复感） ===
    const grassVariants = ['puny_grass', 'puny_grass_var1', 'puny_grass_var2']
    for (let y = 0; y < Math.ceil(height / 16); y++) {
      for (let x = 0; x < Math.ceil(width / 16); x++) {
        // 90% 概率使用基础草地，10% 概率使用变体，避免过于杂乱
        const key = Math.random() < 0.85
          ? 'puny_grass'
          : Phaser.Utils.Array.GetRandom(grassVariants)
        this.add.image(x * 16, y * 16, key).setOrigin(0)
      }
    }

    // === 泥土路（中央横向路径） ===
    const pathY = height / 2
    const pathVariants = ['puny_dirt_path', 'puny_dirt_path_var1', 'puny_dirt_path_var2']
    for (let x = 0; x < Math.ceil(width / 16); x++) {
      for (let py = -2; py <= 2; py++) {
        const key = Phaser.Utils.Array.GetRandom(pathVariants)
        this.add.image(x * 16, pathY + py * 16, key).setOrigin(0)
      }
    }

    // === 创建物理碰撞组（用于树木和石头） ===
    this.obstacleGroup = this.physics.add.staticGroup()

    // 响应式判断（提前声明，供后续复用）
    const isMobile = width < 768

    // === 装饰：树木（边缘分布，两种造型交替，带碰撞体积） ===
    const treePositions = [
      { x: 80, y: 100, type: 'tree_round' },
      { x: 150, y: 80, type: 'tree_tall' },
      { x: width - 120, y: 120, type: 'tree_round' },
      { x: width - 80, y: 200, type: 'tree_tall' },
      { x: 100, y: height - 100, type: 'tree_tall' },
      { x: width - 150, y: height - 120, type: 'tree_round' },
      { x: 250, y: 60, type: 'tree_round' },
      { x: width - 250, y: 70, type: 'tree_tall' },
    ]
    treePositions.forEach(pos => {
      const tree = this.add.image(pos.x, pos.y, `puny_${pos.type}`)
      tree.setOrigin(0.5, 0.9) // 稍微偏上，避免底部像素和碰撞体错位
      tree.setDepth(pos.y + 100) // 深度加偏移，确保在其他装饰物之上
      tree.setScale(isMobile ? 1.0 : 1.5) // 移动端缩小避免遮挡过多
      
      // 添加物理碰撞体（树干底部区域，阻挡玩家穿过）
      const collider = this.obstacleGroup.create(pos.x, pos.y) as Phaser.Physics.Arcade.Sprite
      collider.setVisible(false) // 碰撞体不可见，只用于阻挡
      collider.setOrigin(0.5, 1) // 碰撞体锚点在底部
      if (collider.body) {
        collider.body.setSize(isMobile ? 16 : 20, isMobile ? 12 : 16) // 移动端碰撞体也缩小
      }
    })

    // === 装饰：花丛（随机散布，程序生成，弥补素材包中无花卡） ===
    for (let i = 0; i < 20; i++) {
      const x = Phaser.Math.Between(40, width - 40)
      const y = Phaser.Math.Between(40, height - 40)
      if (Math.abs(y - pathY) > 50) {
        this.add.image(x, y, 'flower').setAlpha(0.9).setDepth(y)
      }
    }

    // === 装饰：石头（随机散布，Puny World 素材，带碰撞体积） ===
    const rockVariants = ['puny_rock_small_1', 'puny_rock_small_2', 'puny_rock_small_3', 'puny_rock_small_4']
    for (let i = 0; i < 10; i++) {
      const x = Phaser.Math.Between(50, width - 50)
      const y = Phaser.Math.Between(50, height - 50)
      if (Math.abs(y - pathY) > 60) {
        const key = Phaser.Utils.Array.GetRandom(rockVariants)
        const rock = this.add.image(x, y, key)
        rock.setDepth(y - 10) // 石头深度略低于树，避免遮挡
        rock.setOrigin(0.5, 0.85) // 锚点稍微偏上
        rock.setScale(isMobile ? 0.8 : 1.2) // 移动端缩小

        // 添加物理碰撞体（阻挡玩家穿过）
        const collider = this.obstacleGroup.create(x, y) as Phaser.Physics.Arcade.Sprite
        collider.setVisible(false)
        collider.setOrigin(0.5, 1)
        if (collider.body) {
          collider.body.setSize(isMobile ? 14 : 18, isMobile ? 10 : 14)
        }
      }
    }

    // === 装饰：蘑菇丛（Puny World 素材，点缀细节） ===
    const mushroomVariants = ['puny_mushroom_1', 'puny_mushroom_2', 'puny_mushroom_3', 'puny_mushroom_4', 'puny_mushroom_5', 'puny_mushroom_6']
    for (let i = 0; i < 6; i++) {
      const x = Phaser.Math.Between(40, width - 40)
      const y = Phaser.Math.Between(40, height - 40)
      if (Math.abs(y - pathY) > 45) {
        const key = Phaser.Utils.Array.GetRandom(mushroomVariants)
        this.add.image(x, y, key)
          .setDepth(y - 5)
          .setOrigin(0.5, 0.9)
          .setScale(isMobile ? 0.8 : 1.0)
      }
    }

    // === 装饰：灌木丛（随机散布，程序生成） ===
    for (let i = 0; i < 8; i++) {
      const x = Phaser.Math.Between(40, width - 40)
      const y = Phaser.Math.Between(40, height - 40)
      if (Math.abs(y - pathY) > 45) {
        this.add.image(x, y, 'bush')
          .setDepth(y - 3)
          .setOrigin(0.5, 0.8)
          .setScale(isMobile ? 0.7 : 1.0)
      }
    }

    // 创建玩家（出生点：屏幕中下方）
    this.player = new Player(this, width / 2, height - 100)

    // 设置玩家与障碍物（树木、石头）的碰撞
    this.physics.add.collider(this.player.sprite, this.obstacleGroup)

    // 创建告示牌（左侧）
    this.signboard = new Signboard(this, 200, height / 2)
    this.signboard.setOnInteract(() => this.showSignboardDialog())

    // 创建山洞入口（右上方）
    const caveX = isMobile ? width - 100 : width - 150
    const caveY = isMobile ? 120 : 150
    this.caveEntrance = new CaveEntrance(this, caveX, caveY)
    this.caveEntrance.setOnInteract(() => this.enterCave())
    
    // 山洞入口也需要碰撞体积（阻挡玩家穿过山体，但可以从前方进入）
    const caveScale = isMobile ? 0.6 : 0.8
    const caveMountainCollider = this.obstacleGroup.create(
      this.caveEntrance.sprite.x, 
      this.caveEntrance.sprite.y - 30 * caveScale
    ) as Phaser.Physics.Arcade.Sprite
    caveMountainCollider.setVisible(false)
    caveMountainCollider.setOrigin(0.5, 0.5)
    if (caveMountainCollider.body) {
      caveMountainCollider.body.setSize(
        isMobile ? 60 : 80,
        isMobile ? 40 : 60
      )
    }

    // 设置点击移动控制
    this.input.on('pointerdown', (pointer: Phaser.Input.Pointer) => {
      // 如果有对话框打开，不处理移动
      if (this.dialogBox) return
      
      this.player.moveTo(pointer.x, pointer.y)
    })

    // 场景标题提示
    const hint = this.add.text(width / 2, 30, '点击地面移动玩家', {
      fontSize: '16px',
      color: '#ffffff',
      backgroundColor: '#000000aa',
      padding: { x: 10, y: 5 },
    })
    hint.setOrigin(0.5)

    // 3秒后淡出提示
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

    // 检查玩家与交互对象的距离
    const pos = this.player.getPosition()
    this.signboard.checkPlayerDistance(pos.x, pos.y)
    this.caveEntrance.checkPlayerDistance(pos.x, pos.y)
  }

  private showSignboardDialog(): void {
    if (this.dialogBox) return

    const { width, height } = this.cameras.main

    this.dialogBox = this.add.container(width / 2, height - 120)
    this.dialogBox.setDepth(10000) // 确保对话框在最顶层

    // 对话框背景
    const bg = this.add.rectangle(0, 0, 600, 150, 0x1e2636, 0.95)
    bg.setStrokeStyle(3, 0x38bdf8)
    this.dialogBox.add(bg)

    // 对话文本
    const text = this.add.text(0, -30, '【告示牌】\n\n前方山洞中藏有神秘的魔法水晶，\n据说它能展示世界的秘密...', {
      fontSize: '18px',
      color: '#ffffff',
      align: 'center',
      lineSpacing: 8,
    })
    text.setOrigin(0.5)
    this.dialogBox.add(text)

    // 关闭按钮
    const closeBtn = this.add.text(0, 50, '[ 关闭 ]', {
      fontSize: '16px',
      color: '#38bdf8',
    })
    closeBtn.setOrigin(0.5)
    closeBtn.setInteractive({ useHandCursor: true })
    closeBtn.on('pointerdown', () => this.closeDialog())
    this.dialogBox.add(closeBtn)
  }

  private closeDialog(): void {
    if (this.dialogBox) {
      this.dialogBox.destroy()
      this.dialogBox = null
    }
  }

  private enterCave(): void {
    this.closeDialog()
    this.cameras.main.fadeOut(500, 0, 0, 0)
    this.time.delayedCall(500, () => {
      this.scene.start(SCENES.CAVE_MAP)
    })
  }
}
