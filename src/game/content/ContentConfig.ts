/**
 * 内容播放系统配置
 * 
 * 开发者可以在此配置需要在魔法水晶/电视机屏幕中播放的内容。
 * 支持类型：
 * - image: 单张图片（自动轮播多张）
 * - video: 视频文件（mp4）
 * - ppt: 图片序列模拟 PPT 效果（逐页展示，可点击切换）
 * 
 * 后续可扩展为从服务器/CMS 动态加载。
 */

export type ContentType = 'image' | 'video' | 'ppt'

export interface ContentItem {
  type: ContentType
  /** 资源路径，相对于 /assets/content/ 或完整 URL */
  src: string
  /** 图片/PPT 页面的展示时长（毫秒），video 类型忽略此项 */
  duration?: number
  /** 说明文字，显示在内容下方 */
  caption?: string
}

export interface ContentPlaylist {
  id: string
  title: string
  items: ContentItem[]
}

/**
 * 占位内容播放列表
 * 
 * 当前使用程序生成的占位画面（彩色背景 + 文字），
 * 真实素材接入后替换 items 中的 src 字段即可。
 */
export const PLACEHOLDER_PLAYLIST: ContentPlaylist = {
  id: 'crystal-vision-demo',
  title: '魔法水晶的记忆',
  items: [
    {
      type: 'image',
      src: 'placeholder://slide1',
      duration: 3000,
      caption: '很久以前，这片土地曾经繁荣昌盛...',
    },
    {
      type: 'image',
      src: 'placeholder://slide2',
      duration: 3000,
      caption: '直到有一天，神秘的力量降临...',
    },
    {
      type: 'image',
      src: 'placeholder://slide3',
      duration: 3000,
      caption: '勇者踏上了寻找真相的旅程。',
    },
    {
      type: 'image',
      src: 'placeholder://slide4',
      duration: 3000,
      caption: '（待续...更多内容开发者可自行接入）',
    },
  ],
}

/**
 * 如何接入真实内容：
 * 
 * 1. 视频：
 *    { type: 'video', src: '/assets/content/intro.mp4', caption: '开场介绍' }
 * 
 * 2. 图片轮播：
 *    { type: 'image', src: '/assets/content/photo1.jpg', duration: 4000, caption: '...' }
 * 
 * 3. PPT 序列（本质是图片，逐页点击切换而非自动播放）：
 *    { type: 'ppt', src: '/assets/content/slide1.png', caption: '第一页' }
 * 
 * 将对应文件放入 public/assets/content/ 目录，
 * 并在 ContentPlaylist.items 中按顺序配置即可。
 */
