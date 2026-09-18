import Phaser from 'phaser'
import { SCENES } from '../utils/Constants'
import { TerrainGenerator } from '../graphics/TerrainGenerator'

export class BootScene extends Phaser.Scene {
  constructor() {
    super({ key: SCENES.BOOT })
  }

  preload(): void {
    // 加载 Puny World tileset (CC0)
    const base = 'assets/tilesets/puny'
    const tiles = [
      'grass', 'grass_var1', 'grass_var2',
      'dirt_path', 'dirt_path_var1', 'dirt_path_var2',
      'tree_round', 'tree_tall',
      'rock_small_1', 'rock_small_2', 'rock_small_3', 'rock_small_4', 'rock_cluster',
      'mushroom_1', 'mushroom_2', 'mushroom_3', 'mushroom_4', 'mushroom_5', 'mushroom_6',
    ]
    tiles.forEach(name => {
      this.load.image(`puny_${name}`, `${base}/${name}.png`)
    })

    // 加载巫师角色精灵表 (4方向 x 9姿态，每格 256x320)
    this.load.spritesheet('player_wizard', 'assets/game1/wizard-sprites.png', {
      frameWidth: 256,
      frameHeight: 320,
    })
  }

  create(): void {
    // 生成所有地形和环境素材
    TerrainGenerator.generateAll(this)

    // 注册巫师角色动画
    // wizard-sprites.png 布局: 4列 x 9行
    // 列顺序: front(0) left(1) back(2) right(3)
    // 行顺序: idle(0) happy(1) surprised(2) shy(3) waving(4) walking(5) sitting(6) stars(7) casting(8)
    const directions = [
      { key: 'down',  col: 0 },
      { key: 'left',  col: 1 },
      { key: 'up',    col: 2 },
      { key: 'right', col: 3 },
    ]

    directions.forEach(({ key, col }) => {
      // Phaser 按行扫描图集：frame = row * 4 + column
      const idleFrame = col

      this.anims.create({
        key: `idle_${key}`,
        frames: [{ key: 'player_wizard', frame: idleFrame }],
        frameRate: 1,
      })

      // walking 行的四个方向帧按列分布，不能直接使用连续帧。
      const walkFrame = 5 * 4 + col
      this.anims.create({
        key: `walk_${key}`,
        frames: [{ key: 'player_wizard', frame: walkFrame }],
        frameRate: 8,
        repeat: -1,
      })
    })

    // 资源加载完成后进入登录界面
    this.scene.start(SCENES.LOGIN)
  }
}
