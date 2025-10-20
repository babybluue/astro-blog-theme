---
title: 红米 Note 10 (camellia) 绕过官方等待时间解锁 Bootloader
date: 2025-10-09T03:23:43.411Z
abbrlink: fba1e7f6
tags:
  - 刷机
  - 安卓
description: '红米 Note 10 (camellia) 解锁 Bootloader，绕过小米官方解锁工具需要最少等待绑定 7 天时间的限制，随时解锁，自由搞基'
cover: '@images/fba1e7f6.png'
---

众所周知，通过小米官方解锁工具解锁 Bootloader 的限制是需要机器与小米账号绑定至少 7 天时间，搞机的激情起来了，这一周时间简直是折磨，好在通过 _Mediatek Bootloader Unlock_ 工具，可以在丢失任何数据的情况下，绕过官方解锁工具的等待时间。

1. 下载 _Mediatek Bootloader Unlock.zip_[^1] 文件并解压
2. 安装 _/Driver/cdc-acm.inf_ 文件
3. 安装 _/UsbDk_1.0.22_x64.msi_ 文件
4. 重启电脑
5. 运行 _UnlockBootloader.bat_ 文件，唤出终端界面
6. 手机同时按住音量+/-键和电源键，连接电脑
7. 终端开始出现跑码界面，表示开始解锁，在解锁成功之后终端会自动关闭。

完成操作之后，电源键开机就可以看到已经解锁的标志了。

> [!NOTE]
> 天玑 Mediatek 系列的手机都可以尝试通过这个工具解锁手机，即使不成功也不会有什么影响。

[^1]: [Mediatek Bootloader Unlock.zip](https://xdaforums.com/attachments/mediatekbootloaderunlock-zip.5941273/)
