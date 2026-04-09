# 部署文档 — 北京莱博塔传媒科技官网

> 将 React 18 + Vite 项目部署到 Ubuntu 24.04 服务器（192.168.10.130）的完整记录

---

## 环境信息

| 项目 | 详情 |
|------|------|
| 本地系统 | Windows 11（PowerShell + OpenSSH） |
| 远程服务器 | 192.168.10.130 |
| 服务器系统 | Ubuntu 24.04.4 LTS |
| 服务器用户 | root |
| Web 服务器 | Nginx 1.24.0 |
| 项目技术栈 | React 18 + Vite 6 |

---

## 部署流程

### 第一步：本地构建项目

在项目根目录执行生产构建命令：

```bash
npm run build
```

Vite 将所有源码打包输出到 `dist/` 目录，构建产物如下：

```
dist/
├── index.html                        0.83 kB
├── favicon.svg
├── logo.svg
└── assets/
    ├── index-CKGFOW_j.js           160.72 kB  (gzip: 52 kB)
    ├── index-k8SOt-EE.css           17.72 kB  (gzip: 4.3 kB)
    ├── bg_videos-kNsz3-C0.mp4      37,336 kB
    ├── img_1-BXzuV6YN.avif          23.95 kB
    ├── img_2-OQ0om5F3.avif          67.79 kB
    └── img_3-YhWgwm1k.avif         156.72 kB
```

---

### 第二步：安装 SSH 工具（Posh-SSH）

由于 Windows 自带的 OpenSSH 不支持命令行传入密码，安装 PowerShell 的 `Posh-SSH` 模块以实现密码认证的 SSH/SCP 操作：

```powershell
Install-Module -Name Posh-SSH -Force -Scope CurrentUser
```

---

### 第三步：检查远程服务器环境

通过 SSH 连接服务器，确认操作系统版本及 Nginx 是否已安装：

```powershell
$password = ConvertTo-SecureString "你的密码" -AsPlainText -Force
$cred = New-Object System.Management.Automation.PSCredential("root", $password)
Import-Module Posh-SSH

$session = New-SSHSession -ComputerName "192.168.10.130" -Credential $cred -AcceptKey
$result = Invoke-SSHCommand -SessionId $session.SessionId `
    -Command "nginx -v 2>&1; cat /etc/os-release | head -3"
Write-Output $result.Output
Remove-SSHSession -SessionId $session.SessionId
```

**检查结果：** Ubuntu 24.04 LTS，Nginx 未安装。

---

### 第四步：安装 Nginx

在服务器上执行 apt 安装：

```powershell
Invoke-SSHCommand -SessionId $session.SessionId `
    -Command "apt-get update -y; apt-get install -y nginx"
```

安装完成后 systemd 自动注册 nginx.service 并启动。

---

### 第五步：创建网站目录

在服务器上创建项目部署目录和静态资源子目录：

```powershell
Invoke-SSHCommand -SessionId $session.SessionId `
    -Command "mkdir -p /var/www/lbt-web/assets"
```

---

### 第六步：写入 Nginx 配置

在服务器创建站点配置文件 `/etc/nginx/sites-available/lbt-web`：

```nginx
server {
    listen 80;
    server_name _;
    root /var/www/lbt-web;
    index index.html;

    # Gzip 压缩
    gzip on;
    gzip_types text/plain text/css application/json application/javascript
               text/xml application/xml application/xml+rss text/javascript;
    gzip_min_length 1000;

    # 静态资源长期缓存（JS/CSS 带内容哈希，可设为不可变）
    location ~* \.(js|css|png|jpg|jpeg|gif|ico|svg|avif|webp|woff|woff2|ttf|eot)$ {
        expires 30d;
        add_header Cache-Control "public, immutable";
    }

    # 视频文件缓存
    location ~* \.(mp4|webm|ogg)$ {
        expires 7d;
        add_header Cache-Control "public";
    }

    # SPA 路由回退 — 所有路径均指向 index.html
    location / {
        try_files $uri $uri/ /index.html;
    }
}
```

启用站点配置并禁用默认站点：

```powershell
Invoke-SSHCommand -SessionId $session.SessionId -Command `
    "ln -sf /etc/nginx/sites-available/lbt-web /etc/nginx/sites-enabled/lbt-web;
     rm -f /etc/nginx/sites-enabled/default;
     nginx -t"
```

`nginx -t` 输出 `syntax is ok / test is successful` 即为配置正确。

---

### 第七步：上传构建产物（SCP）

使用 `Set-SCPItem` 将 dist 目录下的所有文件逐一传输到服务器：

```powershell
# 上传 index.html 及 SVG 图标
Set-SCPItem -ComputerName "192.168.10.130" -Credential $cred -AcceptKey `
    -Path "D:\lbt-web\dist\index.html"   -Destination "/var/www/lbt-web/"
Set-SCPItem ... -Path "D:\lbt-web\dist\favicon.svg" -Destination "/var/www/lbt-web/"
Set-SCPItem ... -Path "D:\lbt-web\dist\logo.svg"    -Destination "/var/www/lbt-web/"

# 上传 CSS / JS
Set-SCPItem ... -Path "D:\lbt-web\dist\assets\index-k8SOt-EE.css"  -Destination "/var/www/lbt-web/assets/"
Set-SCPItem ... -Path "D:\lbt-web\dist\assets\index-CKGFOW_j.js"   -Destination "/var/www/lbt-web/assets/"

# 上传图片
Set-SCPItem ... -Path "D:\lbt-web\dist\assets\img_1-BXzuV6YN.avif" -Destination "/var/www/lbt-web/assets/"
Set-SCPItem ... -Path "D:\lbt-web\dist\assets\img_2-OQ0om5F3.avif" -Destination "/var/www/lbt-web/assets/"
Set-SCPItem ... -Path "D:\lbt-web\dist\assets\img_3-YhWgwm1k.avif" -Destination "/var/www/lbt-web/assets/"

# 上传视频（37 MB）
Set-SCPItem ... -Path "D:\lbt-web\dist\assets\bg_videos-kNsz3-C0.mp4" -Destination "/var/www/lbt-web/assets/"
```

---

### 第八步：启动 Nginx 并设为开机自启

```powershell
Invoke-SSHCommand -SessionId $session.SessionId `
    -Command "systemctl restart nginx; systemctl enable nginx; systemctl status nginx"
```

---

## 验证结果

### 服务器端验证

```bash
# 服务器内部 HTTP 请求
wget -q -O - --server-response http://localhost/ 2>&1 | head -10
```

输出：
```
HTTP/1.1 200 OK
Server: nginx/1.24.0 (Ubuntu)
Content-Type: text/html
...
```

### 客户端验证（PowerShell）

```powershell
$r = Invoke-WebRequest -Uri "http://192.168.10.130/" -UseBasicParsing
Write-Output "HTTP Status: $($r.StatusCode)"   # → 200
Write-Output "Server: $($r.Headers['Server'])" # → nginx/1.24.0 (Ubuntu)
```

---

## 访问地址

```
http://192.168.10.130
```

---

## 服务器目录结构

```
/var/www/lbt-web/
├── index.html
├── favicon.svg
├── logo.svg
└── assets/
    ├── index-CKGFOW_j.js
    ├── index-k8SOt-EE.css
    ├── bg_videos-kNsz3-C0.mp4
    ├── img_1-BXzuV6YN.avif
    ├── img_2-OQ0om5F3.avif
    └── img_3-YhWgwm1k.avif
```

---

## 日后更新部署

每次代码修改后，重复以下步骤即可完成更新：

```bash
# 1. 本地重新构建
npm run build

# 2. 重新上传（PowerShell）
#    由于 Vite 构建产物文件名含内容哈希，每次文件名会变化
#    建议先在服务器清空旧文件再上传：
#    rm -rf /var/www/lbt-web/* && mkdir -p /var/www/lbt-web/assets

# 3. 使用 Set-SCPItem 重新上传所有 dist 文件

# 4. Nginx 无需重启（静态文件服务器，文件替换后立即生效）
```

---

*文档生成时间：2026-04-09*
