---
title: 使用 Cloudflare Tunnel 实现内网穿透
date: 2025-03-16T09:31:30.304Z
abbrlink: 377eef1
tags: ['路由器', '网络', 'Home Assistant']
description: '利用 Cloudflare Zero Trust, 通过创建 Cloudflare Tunnel 实现内网穿透，随时随地访问家中的路由器以及 Home Assistant'
---

#### 域名

使用 Cloudflare Tunnel 必须先有一个自己的域名，最近又机缘巧合地发现 Spaceship[^1] .xyz 的数字域名续费 10 年不到 50RMB，买个域名拿来做内网穿透再好不过。  
[^1]: [启动您的网站、想法和未来 - Spaceship](https://www.spaceship.com/zh/)

在 Spaceship 购买域名之后，需要先在 Cloudflare 注册，将域名的 DNS 服务器改为 Cloudflare，具体的流程如下：

- Cloudflare 账户主页：添加域 > 输入域名 > 快速扫描 DNS 记录 > 选择 Free 计划 > 记录 Cloudflare DNS 服务器地址

  ```bash
  ulla.ns.cloudflare.com
  ernest.ns.cloudflare.com
  ```

- Spaceship: 域管理器 > 名称服务器 > 自定义名称服务器

因为在 60 天内注册的域名暂时还不能转移到 Cloudflare，可以等 60 天后将域名转移到 Cloudflare，就彻底不再需要 Spaceship 了。

#### Tunnel

Zero Trust > 网络 > Tunnels 创建隧道，选择通过 Docker 创建，记住 token 完善 compose 文件。

```yaml
services:
  cloudflared:
    image: cloudflare/cloudflared:latest
    container_name: cloudflare_tunnel
    command: tunnel --no-autoupdate run --token ${your token}
    restart: always
    network_mode: host
```

`docker compose up -d`运行成功后，添加公共主机名设置内网映射。

```bash
# 设置路由器地址映射
router.<domain>.xyz > http://192.168.6.1

# 设置 Home Assistant 地址映射
homeassistant.<domain>.xyz > http://192.168.6.123:8123

# 设置 SSH 地址映射
terminal.<domain>.xyz > http://192.168.6.1:22

# 设置远程桌面
pc.<domain>.xyz > http://192.168.6.1:3389
```

> [!TIP]
> SSH 连接需要连接设备安装 cloudflared, 或者后面设置 Access，通过网页连接

> [!TIP]
> 设置 Home Assistant 之后，访问遇到 501 的错误，查看 Home Assistant 日志发现错误 "A request from a reverse proxy was received from 192.168.6.123, but your HTTP integration is not set-up for reverse proxies"
> 需要 在 Home Assistant configuration.yaml 文件中配置
>
> ```bash
> http:
>  use_x_forwarded_for: true
>  trusted_proxies:
>    - 192.168.6.123
> ```

#### Access

尽管 Cloudflare 可以保证暴露出的内网地址的隐私性，但是无法保证内网信息的安全性，对于路由器等不适合公开的地址还是要使用 Access 加一层保护。  
Access 可以在访问域名页面前加一层 Cloudflare 的身份验证，你可以设置允许的邮箱登录或者其他第三方登录，只有登录者通过了 Access 的验证才能访问内网。

Access > 应用程序 > 添加应用程序 > 自托管 > 添加公共主机名 > 创建策略，创建策略时，选择 Emails，添加允许的邮箱地址，在登录 Access 时只有这些邮箱地址可以收到 Cloudflare 的邮箱验证码。除了 Emails 还有其他一些规则，部分规则只有需要设置第三方登录选择之后才有作用。

> [!TIP]
> 对于 SSH 连接，可以设置网页的方式访问，为 SSH 访问方式单独创建一个应用程序，添加需要 SSH 访问的域名地址，在高级设置 > 浏览器呈现方式，选择 SSH。设置成功后，在浏览器访问域名地址并且通过 Access 后，会提示输入用户名/密码，之后即可正常访问。
