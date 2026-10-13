# 万寻导航 / Wanfind（wanfind.com）

通用导航网站骨架，技术栈与部署方式对齐 [invest-nav](../invest-nav)：Nuxt 3 + Vue 3 + TypeScript + Tailwind CSS，发布到 Cloudflare Workers。

## 技术栈

- Nuxt 3
- Vue 3
- TypeScript
- Nitro
- Tailwind CSS
- Cloudflare Workers（`cloudflare_module`）
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
├── pages/
├── public/
├── server/routes/         # sitemap.xml / robots.txt
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
npm run dev
```

浏览器访问：http://localhost:3000

## 构建与部署

```bash
npm run build
npm run deploy
```

更稳妥的手动部署：

```bash
npm run build
npx wrangler --cwd .output deploy
```

GitHub Actions：推送到 `main` 或手动触发 workflow。仓库 Secrets 需配置：

- `CLOUDFLARE_API_TOKEN`
- `CLOUDFLARE_ACCOUNT_ID`

## 环境变量

| 变量                   | 说明                                             |
| ---------------------- | ------------------------------------------------ |
| `NUXT_PUBLIC_SITE_URL` | 站点 origin，用于 canonical、OG、sitemap、robots |

生产域名：`https://wanfind.com`（已写入 `wrangler.jsonc` 与 `nuxt.config.ts`）。

本地开发保持 `NUXT_PUBLIC_SITE_URL=http://localhost:3000`；部署后 Cloudflare Worker vars 与自定义域名 routes 使用生产地址。

## 自定义内容

1. 站点名称与文案：`utils/site.ts`
2. 导航分类与链接：`data/navigation.json`
3. 分组展示：`utils/navigation.ts` 中的 `navigationGroups`
