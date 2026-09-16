import Phaser from 'phaser'
import { SCENES } from '../utils/Constants'
import { CharacterGenerator } from '../graphics/CharacterGenerator'
import { TerrainGenerator } from '../graphics/TerrainGenerator'

export class BootScene extends Phaser.Scene {
  constructor() {
    super({ key: SCENES.BOOT })
  }

  preload(): void {
    // 加载真实像素素材（Puny World 16x16 tileset by Shade, CC0 授权
    // https://opengameart.org/content/16x16-puny-world-tileset）
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
  }

  create(): void {
    // 生成所有地形和环境素材
    TerrainGenerator.generateAll(this)
    
    // 生成角色精灵表
    CharacterGenerator.generateTrumpCharacter(this)
    
    // 注册角色动画
    const directions = ['down', 'up', 'side'] as const
    
    directions.forEach((dir, row) => {
      // 待机动画（第0帧）
      this.anims.create({
        key: `idle_${dir}`,
        frames: [{ key: 'player_trump', frame: row * 4 }],
        frameRate: 1,
      })

      // 走路动画（4帧循环）
      this.anims.create({
        key: `walk_${dir}`,
        frames: this.anims.generateFrameNumbers('player_trump', {
          start: row * 4,
          end: row * 4 + 3,
        }),
        frameRate: 8,
        repeat: -1,
      })
    })
    
    // 资源加载完成后进入登录界面
    this.scene.start(SCENES.LOGIN)
  }
}
