/**
 * 星露谷风格地形纹理生成器
 * 基于程序化像素绘制，模拟草地、石板路、泥土等地形
 */

export class TerrainGenerator {
  /**
   * 生成草地纹理 (16x16 瓦片，带随机草点装饰)
   */
  static generateGrassTile(scene: Phaser.Scene): string {
    const size = 16
    const texture = scene.textures.createCanvas('grass_tile', size, size)
    const ctx = texture?.getContext()
    if (!ctx) return 'grass_tile'

    // 基础草地色 (多层次绿色)
    const baseGreen = '#4a7c3a'
    const darkGreen = '#3d6630'
    const lightGreen = '#5a9048'

    ctx.fillStyle = baseGreen
    ctx.fillRect(0, 0, size, size)

    // 添加纹理变化（随机深浅斑块）
    for (let i = 0; i < 8; i++) {
      const x = Math.floor(Math.random() * size)
      const y = Math.floor(Math.random() * size)
      const w = Math.floor(Math.random() * 4) + 2
      const h = Math.floor(Math.random() * 4) + 2
      ctx.fillStyle = Math.random() > 0.5 ? darkGreen : lightGreen
      ctx.fillRect(x, y, w, h)
    }

    // 草点装饰
    for (let i = 0; i < 12; i++) {
      const x = Math.floor(Math.random() * size)
      const y = Math.floor(Math.random() * size)
      ctx.fillStyle = '#6fb85f'
      ctx.fillRect(x, y, 1, 1)
    }

    if (texture) texture.refresh()
    return 'grass_tile'
  }

  /**
   * 生成石板路纹理 (16x16)
   */
  static generateStonePath(scene: Phaser.Scene): string {
    const size = 16
    const texture = scene.textures.createCanvas('stone_path', size, size)
    const ctx = texture?.getContext()
    if (!ctx) return 'stone_path'

    // 底色：浅灰土色
    ctx.fillStyle = '#8b8279'
    ctx.fillRect(0, 0, size, size)

    // 石板（3x3网格，每块稍有变化）
    const stoneSize = 5
    const gap = 0.5
    for (let row = 0; row < 3; row++) {
      for (let col = 0; col < 3; col++) {
        const x = col * (stoneSize + gap)
        const y = row * (stoneSize + gap)
        const shade = Math.random() > 0.5 ? '#a39c92' : '#968e84'
        ctx.fillStyle = shade
        ctx.fillRect(x, y, stoneSize, stoneSize)

        // 边缘阴影
        ctx.fillStyle = '#6b655d'
        ctx.fillRect(x + stoneSize - 1, y, 1, stoneSize)
        ctx.fillRect(x, y + stoneSize - 1, stoneSize, 1)
      }
    }

    if (texture) texture.refresh()
    return 'stone_path'
  }

  /**
   * 生成花丛 (8x8 小物件)
   */
  static generateFlower(scene: Phaser.Scene): string {
    const size = 8
    const texture = scene.textures.createCanvas('flower', size, size)
    const ctx = texture?.getContext()
    if (!ctx) return 'flower'

    // 花茎 (绿色)
    ctx.fillStyle = '#4a7c3a'
    ctx.fillRect(3, 4, 2, 4)

    // 花瓣 (4个方向，粉色/黄色/蓝色随机)
    const colors = ['#ff6b9d', '#ffd93d', '#6fb8ff']
    const color = colors[Math.floor(Math.random() * colors.length)]
    if (color) ctx.fillStyle = color

    // 十字花瓣
    ctx.fillRect(4, 2, 1, 1) // 上
    ctx.fillRect(4, 4, 1, 1) // 下
    ctx.fillRect(2, 3, 1, 1) // 左
    ctx.fillRect(5, 3, 1, 1) // 右

    // 花心
    ctx.fillStyle = '#fff5a0'
    ctx.fillRect(3, 3, 2, 1)

    if (texture) texture.refresh()
    return 'flower'
  }

  /**
   * 生成树木精灵 (32x48，带树冠和树干)
   */
  static generateTree(scene: Phaser.Scene): string {
    const width = 32
    const height = 48
    const texture = scene.textures.createCanvas('tree', width, height)
    const ctx = texture?.getContext()
    if (!ctx) return 'tree'

    // 树干 (中下部，深棕色)
    ctx.fillStyle = '#5c3a21'
    ctx.fillRect(13, 28, 6, 20) // 主干

    // 树干高光
    ctx.fillStyle = '#7a4e2f'
    ctx.fillRect(13, 28, 2, 20)

    // 树冠 (圆形分层，深绿到浅绿)
    const layers = [
      { y: 8, w: 28, h: 10, color: '#2d5016' },   // 最深层
      { y: 12, w: 24, h: 12, color: '#3d6630' },  // 中层
      { y: 18, w: 20, h: 10, color: '#4a7c3a' },  // 亮层
    ]

    layers.forEach(layer => {
      ctx.fillStyle = layer.color
      const x = (width - layer.w) / 2
      // 椭圆近似（用矩形堆叠）
      for (let i = 0; i < layer.h; i++) {
        const ratio = Math.sin((i / layer.h) * Math.PI) // 椭圆弧度
        const w = layer.w * ratio
        const offsetX = (layer.w - w) / 2
        ctx.fillRect(x + offsetX, layer.y + i, w, 1)
      }
    })

    // 树冠高光点（模拟叶子亮部）
    ctx.fillStyle = '#5a9048'
    for (let i = 0; i < 15; i++) {
      const x = 6 + Math.random() * 20
      const y = 10 + Math.random() * 18
      ctx.fillRect(x, y, 2, 2)
    }

    if (texture) texture.refresh()
    return 'tree'
  }

  /**
   * 生成灌木丛 (16x14，圆润的丛状造型，星露谷常见地面装饰)
   */
  static generateBush(scene: Phaser.Scene): string {
    const w = 16
    const h = 14
    const texture = scene.textures.createCanvas('bush', w, h)
    const ctx = texture?.getContext()
    if (!ctx) return 'bush'

    const darkGreen = '#2d5016'
    const midGreen = '#3d6630'
    const lightGreen = '#5a9048'

    // 底层阴影（丛底部深色，近似椭圆堆叠）
    ctx.fillStyle = darkGreen
    for (let y = 4; y < h; y++) {
      const ratio = Math.sin(((y - 4) / (h - 4)) * Math.PI)
      const width = w * 0.9 * ratio
      ctx.fillRect((w - width) / 2, y, width, 1)
    }

    // 中层
    ctx.fillStyle = midGreen
    for (let y = 2; y < h - 3; y++) {
      const ratio = Math.sin(((y - 2) / (h - 5)) * Math.PI)
      const width = w * 0.75 * ratio
      ctx.fillRect((w - width) / 2, y, width, 1)
    }

    // 高光叶点
    ctx.fillStyle = lightGreen
    for (let i = 0; i < 6; i++) {
      const x = 2 + Math.random() * (w - 4)
      const y = 2 + Math.random() * (h - 6)
      ctx.fillRect(x, y, 2, 1)
    }

    if (texture) texture.refresh()
    return 'bush'
  }

  /**
   * 生成石头/岩石 (多种尺寸)
   */
  static generateRock(scene: Phaser.Scene, size: number = 16): string {
    const key = `rock_${size}`
    const texture = scene.textures.createCanvas(key, size, size)
    const ctx = texture?.getContext()
    if (!ctx) return key

    // 底色：灰色
    ctx.fillStyle = '#6b7280'
    
    // 不规则形状（近似圆）
    const centerX = size / 2
    const centerY = size / 2
    const radius = size / 2 - 2

    for (let y = 0; y < size; y++) {
      for (let x = 0; x < size; x++) {
        const dx = x - centerX
        const dy = y - centerY
        const dist = Math.sqrt(dx * dx + dy * dy)
        
        // 添加随机凹凸
        const noise = Math.random() * 3
        if (dist < radius + noise) {
          const shade = dist < radius / 2 ? '#9ca3af' : '#6b7280'
          ctx.fillStyle = shade
          ctx.fillRect(x, y, 1, 1)
        }
      }
    }

    // 高光
    ctx.fillStyle = '#d1d5db'
    ctx.fillRect(centerX - 2, centerY - 3, 3, 2)

    // 阴影
    ctx.fillStyle = '#4b5563'
    for (let i = 0; i < 3; i++) {
      ctx.fillRect(centerX + radius - 4 + i, centerY + radius - 2, 1, 1)
    }

    if (texture) texture.refresh()
    return key
  }

  /**
   * 批量生成所有地形素材
   */
  static generateAll(scene: Phaser.Scene): void {
    this.generateGrassTile(scene)
    this.generateStonePath(scene)
    this.generateFlower(scene)
    this.generateBush(scene)
    this.generateTree(scene)
    this.generateRock(scene, 16)
    this.generateRock(scene, 24)
    this.generateRock(scene, 32)
  }
}
