/**
 * 星露谷风格角色精灵生成器
 * 生成更细致的像素角色，带有明显特征（Trump 造型）
 */

export class CharacterGenerator {
  /**
   * 生成 Trump 风格角色精灵表 (4列×3行，32×48/帧)
   * 改进版：更细致的像素画，头发、西装、领带更清晰
   */
  static generateTrumpCharacter(scene: Phaser.Scene): string {
    const frameWidth = 32
    const frameHeight = 48
    const cols = 4
    const rows = 3

    const textureWidth = frameWidth * cols
    const textureHeight = frameHeight * rows

    const texture = scene.textures.createCanvas(
      'player_trump',
      textureWidth,
      textureHeight
    )
    const ctx = texture?.getContext()
    if (!ctx) return 'player_trump'

    // 颜色定义
    const colors = {
      // 皮肤
      skin: '#f4c4a0',
      skinDark: '#d9a682',
      // 头发 (标志性金黄色)
      hair: '#f9d71c',
      hairDark: '#e6c200',
      // 西装
      suitDark: '#1a1d2e',
      suitMid: '#2b2f42',
      // 领带
      tie: '#d42a2a',
      tieDark: '#a81f1f',
      // 衬衫
      shirt: '#ffffff',
      shirtShade: '#e8e8e8',
      // 鞋子
      shoe: '#2a2a2a',
    }

    /**
     * 绘制单帧
     * @param col 列索引 (0-3)
     * @param row 行索引 (0-2: down/up/side)
     * @param swing 手臂腿部摆动偏移 (-2 到 +2)
     */
    const drawFrame = (col: number, row: number, swing: number) => {
      const offsetX = col * frameWidth
      const offsetY = row * frameHeight

      const centerX = offsetX + frameWidth / 2
      const baseY = offsetY + frameHeight - 8

      // 方向: 0=down, 1=up, 2=side
      const direction = row

      // === 鞋子/腿部 (最底层) ===
      if (direction === 0 || direction === 1) {
        // 正面/背面：两只脚
        ctx.fillStyle = colors.suitDark
        // 左腿
        ctx.fillRect(centerX - 6, baseY - 12, 4, 10)
        // 右腿
        ctx.fillRect(centerX + 2, baseY - 12, 4, 10)

        // 鞋子
        ctx.fillStyle = colors.shoe
        ctx.fillRect(centerX - 6 + swing, baseY - 2, 5, 3) // 左脚（swing 影响）
        ctx.fillRect(centerX + 2 - swing, baseY - 2, 5, 3) // 右脚
      } else {
        // 侧面：单腿视角
        ctx.fillStyle = colors.suitDark
        ctx.fillRect(centerX - 2, baseY - 12, 4, 10)

        ctx.fillStyle = colors.shoe
        ctx.fillRect(centerX - 2 + swing, baseY - 2, 5, 3)
      }

      // === 身体（西装） ===
      ctx.fillStyle = colors.suitDark
      if (direction === 0 || direction === 1) {
        // 正面/背面：矩形身体
        ctx.fillRect(centerX - 7, baseY - 26, 14, 14)
      } else {
        // 侧面：稍窄
        ctx.fillRect(centerX - 6, baseY - 26, 12, 14)
      }

      // 西装高光
      ctx.fillStyle = colors.suitMid
      ctx.fillRect(centerX - 6, baseY - 26, 3, 12)

      // 西装纽扣（正面细节）
      if (direction === 0) {
        ctx.fillStyle = '#c9a227'
        ctx.fillRect(centerX - 1, baseY - 18, 1, 1)
        ctx.fillRect(centerX - 1, baseY - 15, 1, 1)
      }

      // === 领带（仅正面可见） ===
      if (direction === 0) {
        ctx.fillStyle = colors.tie
        ctx.fillRect(centerX - 1, baseY - 24, 2, 8)
        ctx.fillStyle = colors.tieDark
        ctx.fillRect(centerX, baseY - 24, 1, 8)
      }

      // === 衬衫领口（正面） ===
      if (direction === 0) {
        ctx.fillStyle = colors.shirt
        ctx.fillRect(centerX - 3, baseY - 26, 6, 2)
      }

      // === 手臂 ===
      ctx.fillStyle = colors.suitDark
      if (direction === 0 || direction === 1) {
        // 正面/背面：左右手臂
        // 左臂（swing 影响前后）
        ctx.fillRect(centerX - 10, baseY - 24 - swing, 3, 10)
        // 右臂
        ctx.fillRect(centerX + 7, baseY - 24 + swing, 3, 10)
      } else {
        // 侧面：一只手臂可见
        ctx.fillRect(centerX + 6, baseY - 24 + swing, 3, 10)
      }

      // 手（肤色）
      ctx.fillStyle = colors.skin
      if (direction === 0 || direction === 1) {
        ctx.fillRect(centerX - 10, baseY - 16 - swing, 3, 3)
        ctx.fillRect(centerX + 7, baseY - 16 + swing, 3, 3)
      } else {
        ctx.fillRect(centerX + 6, baseY - 16 + swing, 3, 3)
      }

      // === 头部（椭圆，肤色） ===
      ctx.fillStyle = colors.skin
      if (direction === 0 || direction === 1) {
        // 正面/背面：椭圆头
        for (let dy = 0; dy < 12; dy++) {
          const ratio = Math.sin((dy / 12) * Math.PI)
          const w = Math.floor(10 * ratio)
          ctx.fillRect(centerX - w / 2, baseY - 38 + dy, w, 1)
        }
      } else {
        // 侧面：稍窄椭圆
        for (let dy = 0; dy < 12; dy++) {
          const ratio = Math.sin((dy / 12) * Math.PI)
          const w = Math.floor(8 * ratio)
          ctx.fillRect(centerX - w / 2, baseY - 38 + dy, w, 1)
        }
      }

      // 头部阴影
      ctx.fillStyle = colors.skinDark
      if (direction === 0) {
        ctx.fillRect(centerX - 3, baseY - 30, 6, 2)
      }

      // === 五官 ===
      if (direction === 0) {
        // 正面：眉毛
        ctx.fillStyle = colors.hairDark
        ctx.fillRect(centerX - 3, baseY - 36, 2, 1)
        ctx.fillRect(centerX + 1, baseY - 36, 2, 1)

        // 眼睛
        ctx.fillStyle = '#000000'
        ctx.fillRect(centerX - 3, baseY - 35, 2, 1)
        ctx.fillRect(centerX + 1, baseY - 35, 2, 1)

        // 脸颊红晕（增添生动感）
        ctx.fillStyle = '#e8a67e'
        ctx.fillRect(centerX - 4, baseY - 33, 1, 1)
        ctx.fillRect(centerX + 3, baseY - 33, 1, 1)

        // 嘴巴
        ctx.fillStyle = '#000000'
        ctx.fillRect(centerX - 2, baseY - 32, 4, 1)
      } else if (direction === 1) {
        // 背面：后脑勺，无五官
      } else {
        // 侧面：眉毛
        ctx.fillStyle = colors.hairDark
        ctx.fillRect(centerX + 2, baseY - 36, 2, 1)

        // 一只眼
        ctx.fillStyle = '#000000'
        ctx.fillRect(centerX + 2, baseY - 35, 2, 1)

        // 脸颊红晕
        ctx.fillStyle = '#e8a67e'
        ctx.fillRect(centerX + 1, baseY - 33, 1, 1)

        // 鼻子（侧面突出）
        ctx.fillStyle = colors.skinDark
        ctx.fillRect(centerX + 4, baseY - 34, 1, 2)
      }

      // === 头发（标志性 Trump 发型） ===
      ctx.fillStyle = colors.hair

      if (direction === 0) {
        // 正面：高耸蓬起的头发，前梳刘海
        // 顶部蓬起区域
        for (let dy = 0; dy < 6; dy++) {
          const w = 12 - dy
          ctx.fillRect(centerX - w / 2, baseY - 46 + dy, w, 1)
        }
        // 刘海（向前梳）
        ctx.fillRect(centerX - 5, baseY - 40, 10, 3)
        // 刘海尖端
        ctx.fillRect(centerX - 4, baseY - 37, 8, 1)

        // 两侧头发
        ctx.fillRect(centerX - 6, baseY - 40, 2, 8)
        ctx.fillRect(centerX + 4, baseY - 40, 2, 8)
      } else if (direction === 1) {
        // 背面：头发盖住后脑
        for (let dy = 0; dy < 8; dy++) {
          const w = 11 - Math.floor(dy / 2)
          ctx.fillRect(centerX - w / 2, baseY - 46 + dy, w, 1)
        }
        // 后脑部分
        ctx.fillRect(centerX - 5, baseY - 38, 10, 6)
      } else {
        // 侧面：明显向前梳的头发尖端（最标志性）
        // 侧面顶部蓬起
        for (let dy = 0; dy < 6; dy++) {
          const w = 10 - dy
          ctx.fillRect(centerX - 4, baseY - 46 + dy, w, 1)
        }
        // 向前梳出的一撮（最关键特征）
        ctx.fillRect(centerX - 2, baseY - 42, 8, 3)
        ctx.fillRect(centerX + 2, baseY - 39, 6, 2)
        ctx.fillRect(centerX + 4, baseY - 37, 4, 1) // 尖端

        // 后侧头发
        ctx.fillRect(centerX - 5, baseY - 40, 3, 8)
      }

      // 头发阴影（深色）
      ctx.fillStyle = colors.hairDark
      if (direction === 0) {
        ctx.fillRect(centerX - 4, baseY - 44, 8, 1)
        ctx.fillRect(centerX + 4, baseY - 38, 2, 4)
      } else if (direction === 2) {
        ctx.fillRect(centerX - 3, baseY - 44, 6, 1)
        ctx.fillRect(centerX + 3, baseY - 38, 2, 1)
      }
    }

    // 生成所有帧
    // 第0行：向下(正面) - 4帧走路循环
    const downSwings = [0, -2, 0, 2]
    downSwings.forEach((swing, col) => drawFrame(col, 0, swing))

    // 第1行：向上(背面) - 4帧走路循环
    const upSwings = [0, -2, 0, 2]
    upSwings.forEach((swing, col) => drawFrame(col, 1, swing))

    // 第2行：侧面 - 4帧走路循环
    const sideSwings = [0, -2, 0, 2]
    sideSwings.forEach((swing, col) => drawFrame(col, 2, swing))

    if (texture) {
      texture.refresh()

      // 将整张画布切分成独立帧，供 AnimationManager 使用
      // 布局：4列 × 3行，frame 索引 = row * cols + col
      for (let row = 0; row < rows; row++) {
        for (let col = 0; col < cols; col++) {
          const frameIndex = row * cols + col
          texture.add(
            frameIndex,
            0,
            col * frameWidth,
            row * frameHeight,
            frameWidth,
            frameHeight
          )
        }
      }
    }

    return 'player_trump'
  }
}
