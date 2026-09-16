import './styles/main.css'
import { createGame } from './game/Game'

let game: Phaser.Game | null = null

// 等待 DOM 加载完成后初始化游戏
window.addEventListener('DOMContentLoaded', () => {
  game = createGame('game-container')
})

// 处理屏幕旋转和尺寸变化
window.addEventListener('resize', () => {
  if (game) {
    game.scale.resize(window.innerWidth, window.innerHeight)
  }
})

// 注册 Service Worker
if ('serviceWorker' in navigator) {
  window.addEventListener('load', () => {
    navigator.serviceWorker.register('/sw.js').then(
      (registration) => {
        console.log('Service Worker registered:', registration.scope)
      },
      (error) => {
        console.log('Service Worker registration failed:', error)
      }
    )
  })
}
