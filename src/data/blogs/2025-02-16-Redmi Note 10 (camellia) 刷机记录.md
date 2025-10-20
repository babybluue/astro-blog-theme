---
title: 红米 Note 10 5G (camellia) 刷入 crDroid
date: 2025-02-15T16:42:25.749Z
abbrlink: 8e0e73dc
cover: '@images/8e0e73dc.png'
tags:
  - 刷机
  - 安卓
description: '如何为红米 Note10 安装 crDroid 系统，以及如何刷入 GApps/Magisk，以及其他的搞机操作。'
---

从我妈手里继承了一台红米 Note 10 5G，系统更新到 MIUI 14，Android 13，在此记录一下和这台手机的相处之道。

#### 代号 Camellia

```bash
adb shell getprop ro.product.system.device
```

搜索发现红米 Note 10 有好多个版本，_红米 Note 10 (mojito)_ / _红米 Note 10S (rosemary)_ / _红米 Note 10 Pro (sweet)_ / _红米 Note 10 5G (camellia)_ / _红米 Note 10 Pro 5G (chopin)_，为了确保自己手机的型号可以使用上面的 adb 命令。

#### Bootloader 解锁

因为当前是 MIUI 系统，只需要将小米 ID 与设备绑定七天，通过小米的官方的[解锁工具](https://www.miui.com/unlock/download.html)就可以解锁了，相比于 Hyper OS 的解锁限制，如此已经很欣慰了 (Hyper OS 的解锁限制真让人失望)。

> [!TIP]
> 现在可以通过 Mediatek Bootloader Unlock 这个工具绕过官方等待时间，直接解锁手机了----[红米 Note 10 (camellia) 绕过官方等待时间解锁 Bootloader](/posts/fba1e7f6)

#### 刷入 crDroid 系统

因为红米 Note 型号很多，搜索发现大部分支持的刷机资源都是非 camellia 型号，好在有[crDroid](https://crdroid.net/)支持 camellia 这个型号，最新版本是 crDroid10 Android 14，最后构建时间是 2024-03-03。

**提前准备**

- [crDroid.net - Download crDroid v10 for RN10 5G/10T/11SE/M3 Pro (camellia)](https://crdroid.net/camellia/10)
- [crDroid recovery](https://sourceforge.net/projects/camellia-build/files/crdroid/boot.img/download)
- [Gapps](https://nikgapps.com/downloads)

**刷机步骤**

```bash
# 1. 重启系统至 bootloader
adb reboot bootloader

# 2. 刷入前面下载的 recovery 文件 boot.img
fastboot flash boot boot.img

# 3. 进入 crDroid 的 recovery 系统
fastboot reboot recovery

# 进入 recovery 后，通过音量和电源键选择 Apply Update > Apply from ADB

# 4. 通过命令 adb 侧载命令刷入 Rom
adb sideload <rom_file>.zip

# 5. 可以刷入 GApps
adb sideload <GApps>.zip

# 重启进入系统
```

#### 其他问题

- 如何从刷机包中获取 boot.img 文件？

  前面在刷入 crDroid 时使用到了 boot.img，这实际是系统的启动镜像，在刷入其他系统时也采用这种方式。

  boot.img 可以从刷机包.zip 文件中提取，有的刷机包解压后可以直接找到 boot.img，没有的话可以找到 payload.bin 文件，使用[payload_dumper](https://github.com/vm03/payload_dumper)提取。

  ```bash
  docker run --rm -v "${PWD}":/data -it vm03/payload_dumper /data/payload.bin --out /data
  ```

- 如何刷入 Magisk？

  在[topjohnwu/Magisk: The Magic Mask for Android](https://github.com/topjohnwu/Magisk)下载安装 apk 文件，安装 > 选择并修补一个文件 > 选择上面的 boot.img，Magisk 会修补 boot.img 生成修补后的镜像 patched_boot.img，将镜像在 bootloader 刷入即可。

  ```bash
  fastboot flash boot patched_boot.img
  ```

- Magisk 模块 - PlayIntegrityFix 通过 Play 保护机制认证

  因为刷机在 Play 商店的 **Play 保护机制认证**会提示设备未经验证，这导致有些软件无法正常使用，比如 ChatGPT，为了通过这个验证，可以刷入 Magisk 模块 [chiteroman/PlayIntegrityFix: Fix Play Integrity (and SafetyNet) verdicts.](https://github.com/chiteroman/PlayIntegrityFix)

- Magisk 模块 - Shamiku 隐藏 Root

  有些软件会检测手机 root 信息，妨碍软件的正常使用，可以使用[Shamiku 模块](https://github.com/LSPosed/LSPosed.github.io/releases)。Shamiku 默认采用黑名单模式，仅对在 Magisk 中选择排除的 APP 生效，如果平时没有特殊的软件需要唤醒授权，可以采用白名单模式，将会对所有软件都隐藏 Root，但是已授权的应用不影响。

  启用白名单需要在`data/adb/shamiko`目录下创建空白文件名 _whitelist_，修改后打开 Magisk 会看到 Shamiku 已经成为了白名单模式。

- 安卓终端工具 Termux

  ```bash
  # 启用 termux 存储权限，可以读取本地文件目录
  termux-setup-storage

  # termux 中使用 adb 连接本机
  # 开发者选项，启用无线调试功能
  # 通过配对码先配对
  adb pair <ip_addr>:<pair-port>
  adb connect <ip_addr>:<adb-port>
  # 或者通过本地地址
  adb connect localhost:<adb-port>

  ```

- DSU 动态系统更新

  Android 11 之后，安卓系统引入了 DSU 加载器，打开设备的开发者模式，可以找到 DSU loader 这个选项，它可以帮你安装一个 GIS 系统到 A/B slot 的另一个分区，安装成功之后，只需要重启就可以启动到新安装的 GIS，开启一个新的原生体验，再次重启后回到主系统，两者互不影响。

  但是实际测试，在开发者模式下的 DSU loader 安装 GIS 系统后，每次重启后卡开机 Logo 后，又重启到了主系统。

  好在有一个帮助自定义安装的 GIS 系统的 DSU 工具--[DSU Sideloader](https://github.com/VegaBobo/DSU-Sideloader?tab=readme-ov-file),下载软件后，在[Community GSIs](https://github.com/phhusson/treble_experimentations/wiki/Generic-System-Image-%28GSI%29-list)下载想要尝试的 GIS 系统，后续只需在 DSU Sideloader 里面操作。

  试了几个 GIS 系统，多数都是卡开机 Logo，只测试出[Pixel OS Android 14](https://github.com/MisterZtr/PixelOS_gsi/releases)可以正常开机成功，不知道是什么原因。
