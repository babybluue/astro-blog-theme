---
title: 利用 margin-top 解决锚点位置被遮挡
date: 2024-08-02T06:42:50.708Z
abbrlink: 43b9393b
tags:
  - CSS
  - 前端
description: '网页 header 设置 fixed 定位，导致锚点位置被 header 遮挡，通过设置 margin-top 为负值以解决遮挡问题。'
---

最近博客添加了标题锚点功能，但是由于页面 header 设置了 fixed 定位，导致锚点位置被 header 遮挡，可以通过结合伪类:target 和 margin-top 为负值来解决。

- :target 伪类用于选中当前锚点，例如 \<a href="#header">Header\</a>，当页面滚动到该锚点时，:target 伪类生效。

- margin-top 为负值，同时配合 padding-top，可以实现视觉效果不变，但是元素在文档流中仍然占据位置。

```css
h1:target {
  padding-top: 100px;
  margin-top: -100px;
}
```
