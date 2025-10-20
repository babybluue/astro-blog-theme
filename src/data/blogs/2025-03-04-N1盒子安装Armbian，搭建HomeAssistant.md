---
title: N1 盒子安装 Armbian，搭建 Home Assistant
date: 2025-03-04T07:26:03.423Z
abbrlink: 64995da6
tags:
  - 路由器
  - Linux
  - Home Assistant
description: '为 斐讯 N1 电视盒子安装轻量 Linux 系统 Armbian，并且在 Armbian 上搭建 Home Assistant，集成米家。'
---

> Armbian（中文名：岸边）系统是基于 Debian/Ubuntu 而构建的专门用于 ARM 芯片的轻量级 Linux 系统。Armbian 系统精益、干净，并且 100% 兼容并继承了 Debian/Ubuntu 系统的功能和丰富的软件生态，可以安全稳定地运行在 TF/SD/USB 及设备的 eMMC 里。这个项目保留了 Armbian 官方系统的完整性，并进一步拓展了在电视盒子等一些非官方支持设备上的使用，增加了一些便捷操作指令。现在你可以将电视盒子的安卓 TV 系统更换为 Armbian 系统，让他成为一台功能强大的服务器。[^1]

[^1]: [Armbian 电视盒子项目地址](https://github.com/ophub/amlogic-s9xxx-armbian/blob/main/README.cn.md)

#### 安装系统

- 下载 Armbian 镜像

  [Armbian Github Release](https://github.com/ophub/amlogic-s9xxx-armbian/releases) 页面包含 Armbian 各版本系统：**Armbian_noble (Ubuntu 24.04)**、**Armbian_jammy (Ubuntu 22.04 LTS)**、**Armbian_bullseye (Debian 11)** **Armbian_bookworm (Debian 12)**，根据需要在对应的 release 中搜索 amlogic_s905d(斐讯 N1 芯片型号) 下载系统镜像。

- 烧录安装

  使用 Rufus 等烧录工具，将 Armbian 镜像写入 U 盘后插入 N1 盒子，启动盒子会自动进入 U 盘 Armbian 系统，运行命令`armbian-install`安装系统，安装成功后拔掉 U 盘重启。

- 常用 Armbian 命令

  ```bash
  armbian-update    # 更新内核
  armbian-config    # 修改配置
  armbian-swap 2    # 修改 swap 分区大小
  armbian-apt       # 更换软件源
  armbian-software  # 安装常用软件
  ```

#### 配置系统

- 挂载 U 盘

  由于 N1 盒子存储只有 8G，因此需要挂在一个 U 盘为它扩容，以满足更多存储需要。

  ```bash

  fdisk -l # 查看 u 盘名称 lsblk

  # user - 普通用户名称，以实际用户为主
  # /dev/sda1 - u 盘在系统中的位置
  mkdir /mnt/usbdisk                # 创建 usbdisk 目录
  sudo mount /dev/sda1 /mnt/usbdisk # 将 u 盘目录挂载到 usbdisk 目录
  sudo chown user:user /mnt/usbdisk # 为 usbdisk 目录添加普通用户权限

  # 设置自动挂载
  /dev/sda1 /home/user/usbdisk auto defaults 0 0 # /etc/fstab 文件追加
  ```

- 安装 Docker

  使用`armbian-docker`安装 docker，docker 默认运行在 N1 的存储中，需要将 docker 的运行目录修改到前面挂载的 U 盘目录 usbdisk 中。

  ```bash
  sudo systemctl stop docker                            # 停止 docker 服务
  sudo mv /var/lib/docker /mnt/usbdisk/docker-data      # 将 docker 目录移动到 usb
  sudo ln -s /mnt/usbdisk/docker-data /var/lib/docker   # 创建软连接
  sudo systemctl start docker                           # 启动 docker 服务
  docker info # 检查 docker
  ```

  > [!TIP]
  > 通过直接修改/etc/docker/daemon.json 中的 data-root 也可以修改 docker 的目录，这是官方推荐方式。

#### Home Assistant

- 安装 Home Assistant

  这里通过 Docker 安装 Home Assistant，在用户目录下创建 _homeassistant_ 文件夹 -- 包含 _config_ 文件夹和 _docker-compose.yml_ 文件，运行`docker compose up -d`命令安装，安装成功后在本地地址 8123 端口页面上完成配置[^2]。

  [^2]: [Linux - Home Assistant](https://www.home-assistant.io/installation/linux)

  ```yml
  # docker-compose.yml 文件
  services:
    homeassistant:
      image: 'ghcr.io/home-assistant/home-assistant:stable'
      container_name: homeassistant
      network_mode: host # 设置网络模式为 host，方便苹果家庭等应用搜索局域网设备
      volumes:
        - ./config:/config # 映射目录，HomeAssistant 的配置信息存储将存放在此文件夹
      environment:
        - TZ=Asia/Shanghai # 根据你的时区设置
      restart: unless-stopped
  ```

- Home Assistant 米家集成

  ```bash
  # 安装
  cd config
  git clone https://github.com/XiaoMi/ha_xiaomi_home.git
  cd ha_xiaomi_home
  ./install.sh ~/homeassistant/config

  # 更新
  cd config/ha_xiaomi_home
  git fetch
  git checkout v1.0.0
  ./install.sh ~/homeassistant/config
  ```

  安装成功之后，在 Home Assistant 页面 设置 > 设备与服务 > 添加集成 > "Xiaomi Home" > 登陆账号 > 导入设备，即可在 Home Assistant 页面管理米家设备[^3]。

  对于手持苹果设备的用户来讲，这件事情最显而易见的好处就是可以通过苹果设备的家庭功能与苹果无缝衔接，同上面的步骤相同 添加集成 > "Apple" > "HomeKit Bridge" > 选择要包含的域，设置成功之后，会有一个带有配对码的通知信息，使用苹果家庭应用扫描配对码进行配对绑定苹果家庭。  
  现在就可以摆脱米家 APP 使用苹果自带的家庭应用对设备进行管理，而且合理使用苹果的快捷指令可以实现一些更优雅地自动化控制。

  > [!TIP]
  > 通过主机名映射，可以使用自定义域名代替 IP 地址访问托管在 N1 上的服务，如使用`n1:8123`的地址访问 Home Assistant 页面。
  >
  > ```bash
  >  # 主机名 => IP 地址
  >  n1 => 192.168.2.1
  > ```

[^3]: [ha_xiaomi_home](https://github.com/XiaoMi/ha_xiaomi_home/blob/main/doc/README_zh.md)
