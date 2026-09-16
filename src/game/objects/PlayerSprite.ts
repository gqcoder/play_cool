import Phaser from 'phaser'

/**
 * 星露谷风格像素人物精灵表生成器
 * 造型特点：金色梳头造型（Trump 风格）+ 深色西装 + 红色领带
 *
 * 生成一张精灵表纹理，帆布（canvas）网格布局：
 *   列（4列）= 走路循环帧：[站立, 迈左腿/摆右臂, 站立, 迈右腿/摆左臂]
 *   行（3行）= 朝向：down（正面）/ up（背面）/ side（侧面，向右，向左时用 flipX）
 *
 * ponytail: 纯矩形拼接的程序化像素画，不追求精细美术，够用即可。
 * 后续要换成正式美术素材时，只需要替换 generate() 里的绘制逻辑，
 * 保持纹理 key 和帧尺寸一致即可，不影响 Player/动画调用方代码。
 */

const FRAME_WIDTH = 32
const FRAME_HEIGHT = 48
const COLS = 4
const ROWS = 3

const COLORS = {
  hair: '#f2c14e', // 金黄色头发
  hairShadow: '#d9a83a',
  skin: '#f2b78c',
  skinShadow: '#d99b6f',
  suit: '#1f2a44', // 深色西装
  suitShadow: '#141b2e',
  tie: '#c0392b', // 红色领带
  shoe: '#2b2b2b',
}

type Direction = 'down' | 'up' | 'side'

export class PlayerSpriteGenerator {
  /**
   * 生成玩家精灵表纹理并注册到场景的纹理管理器
   * 纹理 key: 'player_spritesheet'
   */
  static generate(scene: Phaser.Scene): void {
    if (scene.textures.exists('player_spritesheet')) {
      return
    }

    const canvasTexture = scene.textures.createCanvas(
      'player_spritesheet',
      FRAME_WIDTH * COLS,
      FRAME_HEIGHT * ROWS
    )
    if (!canvasTexture) return

    const ctx = canvasTexture.getContext()
    ctx.imageSmoothingEnabled = false

    const directions: Direction[] = ['down', 'up', 'side']

    directions.forEach((dir, rowIndex) => {
      for (let col = 0; col < COLS; col++) {
        const originX = col * FRAME_WIDTH
        const originY = rowIndex * FRAME_HEIGHT
        drawFrame(ctx, originX, originY, dir, col)
      }
    })

    canvasTexture.refresh()

    // 将画布纹理切分为独立帧，供 AnimationManager 使用
    for (let row = 0; row < ROWS; row++) {
      for (let col = 0; col < COLS; col++) {
        const frameIndex = row * COLS + col
        canvasTexture.add(
          frameIndex,
          0,
          col * FRAME_WIDTH,
          row * FRAME_HEIGHT,
          FRAME_WIDTH,
          FRAME_HEIGHT
        )
      }
    }
  }

  /**
   * 注册走路/待机动画（幂等，重复调用不会报错）
   */
  static registerAnimations(scene: Phaser.Scene): void {
    const dirRow: Record<Direction, number> = { down: 0, up: 1, side: 2 }

    const defs: { key: string; dir: Direction }[] = [
      { key: 'down', dir: 'down' },
      { key: 'up', dir: 'up' },
      { key: 'side', dir: 'side' },
    ]

    defs.forEach(({ key, dir }) => {
      const base = dirRow[dir] * COLS

      if (!scene.anims.exists(`idle_${key}`)) {
        scene.anims.create({
          key: `idle_${key}`,
          frames: [{ key: 'player_spritesheet', frame: base }],
          frameRate: 1,
        })
      }

      if (!scene.anims.exists(`walk_${key}`)) {
        scene.anims.create({
          key: `walk_${key}`,
          frames: [
            { key: 'player_spritesheet', frame: base },
            { key: 'player_spritesheet', frame: base + 1 },
            { key: 'player_spritesheet', frame: base + 2 },
            { key: 'player_spritesheet', frame: base + 3 },
          ],
          frameRate: 8,
          repeat: -1,
        })
      }
    })
  }
}

/**
 * 绘制单帧像素人物
 * col: 0=站立中位 1=迈左腿摆右臂 2=站立中位 3=迈右腿摆左臂
 */
function drawFrame(
  ctx: CanvasRenderingContext2D,
  ox: number,
  oy: number,
  dir: Direction,
  col: number
): void {
  const cx = ox + FRAME_WIDTH / 2

  // 走路摆动幅度：0 和 2 是中立姿势，1 和 3 是摆动到两侧的极限姿势
  const swing = col === 1 ? 3 : col === 3 ? -3 : 0
  const legLift = col === 1 || col === 3 ? 2 : 0 // 抬腿时略微抬高身体，模拟重心起伏

  const headY = oy + 6 - legLift
  const bodyTop = oy + 16 - legLift
  const bodyBottom = oy + 34 - legLift
  const legTop = bodyBottom
  const legBottom = oy + 44

  if (dir === 'down' || dir === 'up') {
    drawFrontBackBody(ctx, cx, headY, bodyTop, bodyBottom, legTop, legBottom, swing, dir)
  } else {
    drawSideBody(ctx, cx, headY, bodyTop, bodyBottom, legTop, legBottom, swing)
  }
}

function drawFrontBackBody(
  ctx: CanvasRenderingContext2D,
  cx: number,
  headY: number,
  bodyTop: number,
  bodyBottom: number,
  legTop: number,
  legBottom: number,
  swing: number,
  dir: 'down' | 'up'
): void {
  const isFront = dir === 'down'

  // 双腿（左右交替前后摆动，用左右偏移 + 略微变短模拟前后透视）
  const legWidth = 5
  drawRect(ctx, cx - 7, legTop, legWidth, legBottom - legTop + Math.max(0, -swing), COLORS.suitShadow)
  drawRect(ctx, cx + 2, legTop, legWidth, legBottom - legTop + Math.max(0, swing), COLORS.suitShadow)
  // 鞋子
  drawRect(ctx, cx - 7, legBottom - 3 + Math.max(0, -swing), legWidth, 3, COLORS.shoe)
  drawRect(ctx, cx + 2, legBottom - 3 + Math.max(0, swing), legWidth, 3, COLORS.shoe)

  // 身体（西装躯干）
  drawRect(ctx, cx - 9, bodyTop, 18, bodyBottom - bodyTop, COLORS.suit)

  // 手臂（随走路摆动，前后交替，用左右整体位移体现摆动）
  const armWidth = 4
  const armLen = 14
  drawRect(ctx, cx - 12, bodyTop + 1 + Math.max(0, -swing), armWidth, armLen, COLORS.suitShadow)
  drawRect(ctx, cx + 8, bodyTop + 1 + Math.max(0, swing), armWidth, armLen, COLORS.suitShadow)
  // 手（肤色）
  drawRect(ctx, cx - 12, bodyTop + armLen - 3 + Math.max(0, -swing), armWidth, 4, COLORS.skin)
  drawRect(ctx, cx + 8, bodyTop + armLen - 3 + Math.max(0, swing), armWidth, 4, COLORS.skin)

  if (isFront) {
    // 正面领带（识别特征之一）
    drawRect(ctx, cx - 2, bodyTop + 2, 4, bodyBottom - bodyTop - 4, COLORS.tie)
  }

  // 头部
  drawRect(ctx, cx - 7, headY, 14, 12, isFront ? COLORS.skin : COLORS.skinShadow)

  if (isFront) {
    // 正面：大胆的金色梳头造型 —— 高高梳起并向前梳的标志性刘海
    drawRect(ctx, cx - 8, headY - 6, 16, 6, COLORS.hair)
    drawRect(ctx, cx - 9, headY - 2, 18, 4, COLORS.hair)
    drawRect(ctx, cx - 6, headY - 8, 12, 3, COLORS.hairShadow) // 头顶蓬起的高光/阴影层次
    // 简单五官：一点眼睛暗示朝向
    drawRect(ctx, cx - 4, headY + 5, 2, 2, COLORS.suitShadow)
    drawRect(ctx, cx + 2, headY + 5, 2, 2, COLORS.suitShadow)
  } else {
    // 背面：整片金发盖住后脑，露出经典的梳背造型轮廓
    drawRect(ctx, cx - 8, headY - 5, 16, 17, COLORS.hair)
    drawRect(ctx, cx - 6, headY - 7, 12, 4, COLORS.hairShadow)
  }
}

function drawSideBody(
  ctx: CanvasRenderingContext2D,
  cx: number,
  headY: number,
  bodyTop: number,
  bodyBottom: number,
  legTop: number,
  legBottom: number,
  swing: number
): void {
  // 侧面朝右：前腿/前臂随摆动向前后伸出（用 swing 控制 x 偏移）
  const frontLegX = cx - 2 + swing
  const backLegX = cx - 2 - swing

  // 后腿（远侧，先画，被遮挡的一侧）
  drawRect(ctx, backLegX, legTop, 5, legBottom - legTop, COLORS.suitShadow)
  drawRect(ctx, backLegX, legBottom - 3, 5, 3, COLORS.shoe)

  // 身体
  drawRect(ctx, cx - 8, bodyTop, 16, bodyBottom - bodyTop, COLORS.suit)

  // 后臂
  drawRect(ctx, cx - 9 - swing, bodyTop + 1, 4, 13, COLORS.suitShadow)

  // 前腿（近侧，覆盖在身体前方）
  drawRect(ctx, frontLegX, legTop, 5, legBottom - legTop, COLORS.suit)
  drawRect(ctx, frontLegX, legBottom - 3, 5, 3, COLORS.shoe)

  // 头部（侧脸）
  drawRect(ctx, cx - 6, headY, 13, 12, COLORS.skin)

  // 金色梳头造型侧面轮廓：额前明显向前梳的一撮头发，是识别特征
  drawRect(ctx, cx - 7, headY - 6, 14, 6, COLORS.hair)
  drawRect(ctx, cx - 2, headY - 3, 9, 4, COLORS.hair) // 向前梳出的刘海尖端
  drawRect(ctx, cx - 6, headY - 8, 10, 3, COLORS.hairShadow)

  // 前臂（覆盖在身体前方，靠近头部下方摆动）
  drawRect(ctx, cx + 6 + swing, bodyTop + 1, 4, 13, COLORS.suit)
  drawRect(ctx, cx + 6 + swing, bodyTop + 11, 4, 4, COLORS.skin)
}

function drawRect(
  ctx: CanvasRenderingContext2D,
  x: number,
  y: number,
  w: number,
  h: number,
  color: string
): void {
  if (h <= 0 || w <= 0) return
  ctx.fillStyle = color
  ctx.fillRect(Math.round(x), Math.round(y), Math.round(w), Math.round(h))
}
