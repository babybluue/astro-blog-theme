import type { PostModel } from './src/interfaces/post-model'

// index

export const site = 'https://astro-blog-ecru-phi.vercel.app'

export const title = 'didmax'

export const description = 'didmax 的个人博客，专注于技术分享与生活记录。基于 Astro 构建，简洁快速，支持深色模式。'

export const tooltip = {
  content: '检测到页面内容有更新，是否刷新页面',
  confirm: '是',
  cancel: '否',
}

export const linkAttr = 'abbrlink'

// 配置常量
export const config = {
  postsPerPage: 12,
  latestPostsCount: 8,
  siteName: 'didmax',
  author: 'didmax',
  language: 'zh-CN',
}

export const getPostLink = (post: PostModel) => `/posts/${post.data[linkAttr]}`
