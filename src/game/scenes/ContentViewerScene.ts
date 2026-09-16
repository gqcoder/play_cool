import Phaser from 'phaser'
import { SCENES } from '../utils/Constants'
import { PLACEHOLDER_PLAYLIST, ContentItem } from '../content/ContentConfig'

interface ContentViewerData {
  returnScene: string
}

export class ContentViewerScene extends Phaser.Scene {
  private returnScene: string = SCENES.CAVE_MAP
  private items: ContentItem[] = []
  private currentIndex: number = 0
  private slideTimer: Phaser.Time.TimerEvent | null = null
  private slideContainer: Phaser.GameObjects.Container | null = null
  private captionText!: Phaser.GameObjects.Text
  private progressText!: Phaser.GameObjects.Text

  constructor() {
    super({ key: SCENES.CONTENT_VIEWER })
  }

  init(data: ContentViewerData): void {
    this.returnScene = data.returnScene ?? SCENES.CAVE_MAP
    this.items = PLACEHOLDER_PLAYLIST.items
    this.currentIndex = 0
  }

  create(): void {
    const { width, height } = this.cameras.main

    // 背景：模拟投影幕布/电视机的暗场
    this.add.rectangle(0, 0, width, height, 0x000000).setOrigin(0)

    // 幕布边框（像投影幕布一样的白边）
    const screenWidth = width * 0.75
    const screenHeight = height * 0.6
    const screenX = width / 2
    const screenY = height / 2 - 20

    const frame = this.add.rectangle(screenX, screenY, screenWidth + 20, screenHeight + 20, 0x1a1a1a)
    frame.setStrokeStyle(4, 0x38bdf8)

    // 播放列表标题
    this.add.text(width / 2, 40, PLACEHOLDER_PLAYLIST.title, {
      fontSize: '24px',
      color: '#38bdf8',
      fontStyle: 'bold',
    }).setOrigin(0.5)

    // 幕布内容容器
    this.slideContainer = this.add.container(screenX, screenY)

    // 说明文字
    this.captionText = this.add.text(width / 2, screenY + screenHeight / 2 + 50, '', {
      fontSize: '18px',
      color: '#ffffff',
      align: 'center',
      wordWrap: { width: screenWidth },
    })
    this.captionText.setOrigin(0.5)

    // 进度指示
    this.progressText = this.add.text(width / 2, height - 80, '', {
      fontSize: '14px',
      color: '#888888',
    })
    this.progressText.setOrigin(0.5)

    // 左右切换按钮
    const prevBtn = this.add.text(60, screenY, '◀', {
      fontSize: '32px',
      color: '#ffffff',
    })
    prevBtn.setOrigin(0.5)
    prevBtn.setInteractive({ useHandCursor: true })
    prevBtn.on('pointerdown', () => this.showSlide(this.currentIndex - 1))

    const nextBtn = this.add.text(width - 60, screenY, '▶', {
      fontSize: '32px',
      color: '#ffffff',
    })
    nextBtn.setOrigin(0.5)
    nextBtn.setInteractive({ useHandCursor: true })
    nextBtn.on('pointerdown', () => this.showSlide(this.currentIndex + 1))

    // 退出按钮
    const exitBtn = this.add.text(width - 20, 20, '✕ 退出', {
      fontSize: '16px',
      color: '#ffffff',
      backgroundColor: '#00000088',
      padding: { x: 10, y: 5 },
    })
    exitBtn.setOrigin(1, 0)
    exitBtn.setInteractive({ useHandCursor: true })
    exitBtn.on('pointerdown', () => this.exitViewer())

    // 显示第一张
    this.showSlide(0)

    this.cameras.main.fadeIn(400, 0, 0, 0)
  }

  private showSlide(index: number): void {
    // 循环索引
    const total = this.items.length
    this.currentIndex = ((index % total) + total) % total

    const item = this.items[this.currentIndex]
    if (!item) return

    // 清空容器
    this.slideContainer?.removeAll(true)

    // 目前所有内容都是占位类型，生成彩色背景 + 序号大字
    const screenWidth = this.cameras.main.width * 0.75
    const screenHeight = this.cameras.main.height * 0.6

    const colors = [0x2d5016, 0x1e2636, 0x6b3f1d, 0x3f2d5c]
    const bgColor = colors[this.currentIndex % colors.length] ?? 0x1e2636

    const bg = this.add.rectangle(0, 0, screenWidth, screenHeight, bgColor)
    this.slideContainer?.add(bg)

    const numberText = this.add.text(0, 0, `${this.currentIndex + 1}`, {
      fontSize: '96px',
      color: '#ffffff33',
      fontStyle: 'bold',
    })
    numberText.setOrigin(0.5)
    this.slideContainer?.add(numberText)

    const typeLabel = this.add.text(0, screenHeight / 2 - 30, `[占位素材 - ${item.type.toUpperCase()}]`, {
      fontSize: '14px',
      color: '#ffffff88',
    })
    typeLabel.setOrigin(0.5)
    this.slideContainer?.add(typeLabel)

    // 更新说明文字
    this.captionText.setText(item.caption ?? '')

    // 更新进度
    this.progressText.setText(`${this.currentIndex + 1} / ${total}`)

    // 重置自动播放计时器
    this.slideTimer?.destroy()
    if (item.duration && item.type !== 'ppt') {
      this.slideTimer = this.time.delayedCall(item.duration, () => {
        this.showSlide(this.currentIndex + 1)
      })
    }
  }

  private exitViewer(): void {
    this.slideTimer?.destroy()
    this.cameras.main.fadeOut(400, 0, 0, 0)
    this.time.delayedCall(400, () => {
      this.scene.start(this.returnScene)
    })
  }

  shutdown(): void {
    this.slideTimer?.destroy()
  }
}
