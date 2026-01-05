import { readFileSync, writeFileSync } from 'fs'
import { dirname, join } from 'path'
import { fileURLToPath } from 'url'

import sharp from 'sharp'

const __filename = fileURLToPath(import.meta.url)
const __dirname = dirname(__filename)
const rootDir = join(__dirname, '..', '..') // 项目根目录
const srcDir = join(rootDir, 'src')

// PWA需要的图标尺寸
const sizes = [48, 64, 72, 96, 192, 512]

// 读取SVG文件
const svgPath = join(srcDir, 'assets', 'avatar.svg')
let svgContent = readFileSync(svgPath, 'utf-8')

// 确保SVG背景透明
// 检查是否有背景色设置，如果没有则确保透明
if (!svgContent.includes('fill="none"') && !svgContent.includes('fill="transparent"')) {
  // 如果SVG根元素没有明确的背景设置，确保它是透明的
  // 大多数SVG默认就是透明的，但我们可以显式设置
  if (!svgContent.match(/<svg[^>]*style[^>]*>/)) {
    // 如果SVG没有style属性，添加一个确保背景透明
    svgContent = svgContent.replace(/<svg([^>]*)>/, '<svg$1 style="background: transparent;">')
  }
}

// 确保SVG有明确的透明背景
// 移除可能的白色或黑色背景rect
svgContent = svgContent.replace(/<rect[^>]*fill="(white|#fff|#ffffff|black|#000|#000000)"[^>]*\/>/gi, '')

// 保存修改后的SVG（如果需要）
writeFileSync(svgPath, svgContent, 'utf-8')
console.log('✓ SVG背景已设置为透明')

// 复制SVG到public目录作为favicon
const faviconPath = join(rootDir, 'public', 'favicon.svg')
writeFileSync(faviconPath, svgContent, 'utf-8')
console.log('✓ 已复制 avatar.svg 到 public/favicon.svg')

// 生成各尺寸的PNG
console.log('开始生成PWA图标...')
for (const size of sizes) {
  try {
    const outputPath = join(rootDir, 'public', `pwa-${size}.png`)

    // 计算内容尺寸（占据图标的80%）
    const contentSize = Math.floor(size * 0.8)
    // 计算居中位置的偏移量（10%的padding）
    const offset = Math.floor((size - contentSize) / 2)

    // 创建目标尺寸的透明画布
    const canvas = sharp({
      create: {
        width: size,
        height: size,
        channels: 4,
        background: { r: 0, g: 0, b: 0, alpha: 0 },
      },
    })

    // 将SVG resize到80%尺寸
    const resizedSvg = await sharp(Buffer.from(svgContent))
      .resize(contentSize, contentSize, {
        fit: 'contain',
        background: { r: 0, g: 0, b: 0, alpha: 0 },
      })
      .png()
      .toBuffer()

    // 将缩小后的SVG居中合成到画布上
    await canvas
      .composite([
        {
          input: resizedSvg,
          left: offset,
          top: offset,
        },
      ])
      .png()
      .toFile(outputPath)

    console.log(`✓ 已生成 pwa-${size}.png (${size}x${size}, 内容${contentSize}x${contentSize})`)
  } catch (error) {
    console.error(`✗ 生成 pwa-${size}.png 失败:`, error.message)
  }
}

console.log('完成！所有PWA图标已生成。')
