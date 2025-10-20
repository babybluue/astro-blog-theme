---
title: Notion vs Obsidian
date: 2024-05-28T14:43:40.992Z
abbrlink: 777aa15a
tags:
  - 杂识
description: '为什么我放弃了 Notion，选择使用 Obsidian 作为主要笔记软件，以及 Obsidian 如何实现网络同步'
---

曾经几次入门 Notion 都未能成功，看着网络上各种 Notion 入门教程，接触 Notion 俨然不是一件简单的事情。慢慢接触后才明白使用 Notion 本身并没有什么难度，只不过 Notion 的设计理念让人一时不能习惯，一旦接受理解了它的设定，事情就一目了然了。

Notion 作为一个六边形战士，多端同步、功能强大而且基本免费，可以满足所有的笔记需求。但是 Notion 内容靠云端同步，在网络条件对于国内不是很友好的前提下，每次打开都会首先展示一个粗鄙的加载骨架，而且界面简陋，能用但不够精致简单，这是我放弃它最大的原因。

---

Obsidian 基于 Markdown 语法，并且笔记都以 Markdown 格式优先存于本地，本地加载，无需登录，省却网络方面的担忧，而且界面简洁清爽，不像 Notion 这种六边形战士的粗犷。

由于本地优先，使用 Obsidian 的第一个问题就是如何多端同步，尽管官方有这个功能，但是需要付费支持，这个时候就要体现 Obsidian 的另一个优势 -- 第三方插件库，同样在由 Notion 转换到 Obsidian 时也用到了第三方插件。Obsidian 拥有丰富的插件内容，就像 VSCode 的插件市场，第三方插件可以为 Obsidian 扩展出许多额外的功能，网络上也有许多 Obsidian 推荐插件，合理地使用这些插件可以无痛告别 Notion。

##### [Remotely Save](https://github.com/remotely-save/remotely-save)

同步插件，在 Obsidian 多客户端均下载插件，通过 Cloudflare 的 R2 设置密钥，在插件端配置后实现多端同步。

##### Importer

内容迁移，可以实现从 Notion/Evernote/Apple Notes/OneNote 导入到 Obsidian。

##### Dataview

可以在任意 md 文件中展示特定文件夹下的文章列表，就像 Notion 的 database 展示一样

##### Auto Link Title

粘贴网络链接，可以自动帮助以 Markdown 语法补全链接标题

##### Homepage

添加一个 Obsidian 首页

##### Linter

格式化工具
