---
title: 关于运行 vite 项目遇到 "directory not empty, rmdir .vite/deps_temp" 的报错
date: 2024-11-08T08:22:57.337Z
abbrlink: 8d23c82f
tags:
  - VSCode
  - 前端
cover: '@images/8d23c82f.png'
description: '在运行 vite 项目时，遇到 node:fs handleErrorFromBinding(ctx),ENOTEMPTY: directory not empty, rmdir .vite/deps_temp的报错，该如何解决？'
---

使用 yarn dev 能够正常创建本地地址，但是一旦在浏览器访问该地址就会触发上面的错误。

在尝试了许多方法后，ChatGPT 提醒我有可能是 VSCode 占用了.vite 文件夹，导致删除失败，果然在进程里杀掉 VSCode 的进程，再重新运行 yarn dev 就好了。
