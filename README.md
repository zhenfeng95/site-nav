# 万寻导航 / Wanfind（wanfind.com）

通用导航网站骨架，技术栈与部署方式对齐 [invest-nav](../invest-nav)：Nuxt 3 + Vue 3 + TypeScript + Tailwind CSS，发布到 Cloudflare Workers。

## 技术栈

- Nuxt 3
- Vue 3
- TypeScript
- Nitro
- Tailwind CSS
- Cloudflare Workers（`cloudflare_module`）
- Cloudflare D1（申请收录队列）
- Wrangler

## 目录结构

```text
.
├── assets/css/            # 全局样式
├── components/            # 布局、首页、导航组件
├── composables/           # SEO 等组合式函数
├── data/                  # JSON 数据，与 UI 解耦
│   └── navigation.json
├── layouts/
├── migrations/            # D1 SQL migrations
├── pages/                 # 含 /apply、/admin
├── public/
├── server/
│   ├── api/               # 申请收录与后台 API
│   ├── routes/            # sitemap.xml / robots.txt
│   └── utils/
├── types/
├── utils/                 # 数据读取与站点常量
├── nuxt.config.ts
├── wrangler.jsonc
└── README.md
```

## 环境要求

- Node.js `24.16.0`（与 invest-nav / CI 一致，仓库内已提供 `.nvmrc`）

```bash
nvm use
```

## 安装与本地运行

```bash
npm install
cp .env.example .env
npm run db:migrate:local
npm run dev
```

浏览器访问：http://localhost:3000

- 申请收录：http://localhost:3000/apply
- 管理后台：http://localhost:3000/admin

## 部署架构（简述）

| 角色 | 域名 | 内容 |
| ---- | ---- | ---- |
| 主站 | `https://wanfind.com` | Cloudflare Workers：HTML、API、Admin、D1 |
| 大陆静态镜像 | `https://wan.zzf.net.cn` | 阿里云 Nginx：`/_nuxt`、图标、logo 等静态文件 |

大陆访客（`CF-IPCountry=CN`）静态资源走 `wan.zzf.net.cn`；海外仍走 `wanfind.com`。两边必须是**同一次 build** 的产物，且 **先更新镜像、再发 Worker**，避免 HTML 指向尚未上传的 JS hash。

## 构建与部署

### 首次准备

首次（或 migration 变更后）应用远程 D1：

```bash
nvm use
npm run db:migrate:remote
```

配置 Worker 密钥（只需一次）：

```bash
npx wrangler secret put NUXT_ADMIN_PASSWORD
npx wrangler secret put NUXT_ADMIN_SESSION_SECRET
```

确认生产变量已写入 `wrangler.jsonc`（或 Dashboard）：

- `NUXT_PUBLIC_SITE_URL=https://wanfind.com`
- `NUXT_PUBLIC_CN_ASSET_CDN=https://wan.zzf.net.cn`

`wan.zzf.net.cn` 需：HTTPS、HTTP→HTTPS 跳转、CORS 允许 `https://wanfind.com`（详见下文）。

### 日常发版（推荐）

```bash
nvm use

# 1) build，并生成可上传的 dist/（内容来自 .output/public）
npm run dist

# 2) 将 dist/ 内文件上传到阿里云站点根目录
#    服务器路径示例：/www/wwwroot/wan.zzf.net.cn/dist
#    上传后根上应直接有 _nuxt/、icons/、logo.png 等（不要多包一层 dist 文件夹名）

# 3) 再发布 Cloudflare Worker（勿再 npm run build，以免 hash 与镜像不一致）
npx wrangler --cwd .output deploy
```

`npm run dist` = `nuxt build` + 同步 `.output/public/` → `dist/`。  
`dist/` 已在 `.gitignore` 中，仅作上传包，不入库。

### 若已执行过 deploy、只需刷新本地 dist

`npm run deploy` 会 build 并立刻发布 CF，**不会**上传阿里云。若刚 deploy 完、`.output/public` 仍是这一版：

```bash
npm run dist:sync    # 不重新 build，只把 .output/public 拷到 dist/
# 再把 dist/ 上传到 wan.zzf.net.cn
```

注意：分流上线后，更稳妥仍是 **先上传镜像再 deploy**。若先 deploy 再传镜像，大陆用户可能短暂 404 新 hash 的 JS。

### 相关 npm 脚本

| 命令 | 作用 |
| ---- | ---- |
| `npm run dist` | build + 生成/覆盖 `dist/` |
| `npm run dist:sync` | 不 build，用现有 `.output/public` 同步到 `dist/` |
| `npm run deploy` | build + 发布 Cloudflare（不含阿里云上传） |
| `npx wrangler --cwd .output deploy` | 只发布已有 `.output`（配合 `npm run dist` 使用） |

### 阿里云 / Nginx 要点（wan.zzf.net.cn）

1. `root` 指向放静态文件的目录（如 `/www/wwwroot/wan.zzf.net.cn/dist`）。
2. **80 强制跳转 HTTPS**，避免手机走 http 导致 JS 加载失败。
3. 为 JS/CSS/字体等加上 CORS（Nuxt 带 `crossorigin`）：

```nginx
add_header Access-Control-Allow-Origin "https://wanfind.com" always;
add_header Access-Control-Allow-Methods "GET, HEAD, OPTIONS" always;
add_header Access-Control-Allow-Headers "*" always;
```

正则 `location`（如 `\.js$`）里也要再写一遍 CORS，否则可能不继承。

4. 上传后自检：

```bash
curl -I -H "Origin: https://wanfind.com" https://wan.zzf.net.cn/_nuxt/<某个文件>.js
```

应看到 `Access-Control-Allow-Origin: https://wanfind.com`。

### GitHub Actions

推送到 `main` 或手动触发 workflow。仓库 Secrets：

- `CLOUDFLARE_API_TOKEN`
- `CLOUDFLARE_ACCOUNT_ID`

CI 目前只部署 Cloudflare；**国内 `dist` 仍需按上面步骤手动上传**（或后续自行加同步脚本）。

## 环境变量

| 变量                            | 说明                                                     |
| ------------------------------- | -------------------------------------------------------- |
| `NUXT_PUBLIC_SITE_URL`          | 站点 origin，用于 canonical、OG、sitemap、robots         |
| `NUXT_PUBLIC_CN_ASSET_CDN`      | 大陆静态镜像 origin，如 `https://wan.zzf.net.cn`；本地可留空 |
| `NUXT_ADMIN_PASSWORD`           | 管理后台登录密码                                         |
| `NUXT_ADMIN_SESSION_SECRET`     | 签名 cookie 用密钥（建议长随机串）                       |

生产域名：`https://wanfind.com`；静态镜像：`https://wan.zzf.net.cn`（见 `wrangler.jsonc` / `nuxt.config.ts`）。

本地开发保持 `NUXT_PUBLIC_SITE_URL=http://localhost:3000`，一般不必配置 `NUXT_PUBLIC_CN_ASSET_CDN`。

## 申请收录流程

1. 用户在 `/apply` 提交 → 写入 D1（`pending`）
2. 管理员在 `/admin` 审核（通过 / 拒绝）
3. 通过后仍需把站点写入 `data/navigation.json` 并部署（正式收录源仍是 Git）

## 自定义内容

1. 站点名称与文案：`utils/site.ts`
2. 导航分类与链接：`data/navigation.json`
3. 分组展示：`utils/navigation.ts` 中的 `navigationGroups`
