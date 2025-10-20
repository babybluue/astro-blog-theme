---
title: VMware 安装 Ubuntu 卡顿黑屏的问题
date: 2024-06-24T02:39:36.249Z
abbrlink: ff98a642
tags:
  - 电脑
description: 'Windows11 使用 VMware Workstation Pro 17.5 安装 Ubuntu 桌面板的过程中遭遇卡顿/黑屏问题的解决方案参考，以及 Windows 电源计划被覆盖的问题'
---

系统 Windows11，CPU 13600kf，在使用 VMware WorkStation Pro 17.5 安装 Ubuntu 桌面版时界面卡顿，安装完成后启动 Ubuntu 桌面版遇到频繁黑屏的问题 (后面尝试安装 Linux Mint 时却没有遇到这个问题)。

最终解决办法：

- Window 电源计划选择性能模式 (之前是节能模式)

  > 在控制面板设置电源计划后，发现每次重启又重新回到了节能模式，这往往是因为主板厂商的软件配置默认覆盖了原本的设置，比如微星主板的控制软件中的场景选择为静音，在每次机器启动后将会修改 Windows 电源计划为节能模式。

- VMware Ubuntu 设置 > 显示 > 关闭 3D 加速

根据网络上的答案尝试过的方法：

- 以管理员模式运行 (相当于忽略系统的电源计划)
- 关闭 Window 系统安全 > 设备安全性 > 内核隔离
- 关闭 Hyper-v

关于 VMware 的卡顿问题，在网络上基本看到这几种解决方案，有的适合部分人有的不适合，还是得自己亲自测试后才知道。

---

参考链接：

- [Vmware 17 Pro very slow on Windows 11 22H2 | VMware Workstation](https://community.broadcom.com/vmware-cloud-foundation/communities/community-home/digestviewer/viewthread?MessageKey=4a26b366-be25-479d-afad-fc9ae47b98de&CommunityKey=fb707ac3-9412-4fad-b7af-018f5da56d9f#bm4a26b366-be25-479d-afad-fc9ae47b98de)

- [Slow virtualization on Windows 11 \[VMware Workstation Pro\]](https://www.reddit.com/r/vmware/comments/17w68hw/slow_virtualization_on_windows_11_vmware/)
