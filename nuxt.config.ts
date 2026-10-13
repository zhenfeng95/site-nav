// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
    compatibilityDate: '2025-07-15',
    devtools: { enabled: true },

    // Vite 冷启动会在 Nitro 写出 manifest 之前扫描 #app-manifest，导致 pre-transform 报错。
    experimental: {
        appManifest: false,
    },

    routeRules: {
        // 导航功能区默认 noindex；首页与信任页可收录（见 utils/seo-index.ts）
        '/nav': { index: false },
        '/nav/**': { index: false },
    },

    modules: ['@nuxtjs/tailwindcss', '@nuxtjs/color-mode'],

    css: ['~/assets/css/main.css'],

    colorMode: {
        preference: 'light',
        fallback: 'light',
        hid: 'nuxt-color-mode-script',
        globalName: '__NUXT_COLOR_MODE__',
        classPrefix: '',
        classSuffix: '',
        storageKey: 'site-nav-color-mode',
    },

    tailwindcss: {
        cssPath: '~/assets/css/main.css',
    },

    components: [
        {
            path: '~/components',
            pathPrefix: false,
        },
    ],

    app: {
        head: {
            htmlAttrs: {
                lang: 'zh-CN',
            },
            charset: 'utf-8',
            viewport: 'width=device-width, initial-scale=1',
            link: [
                { rel: 'icon', type: 'image/png', href: '/favicon.png' },
                { rel: 'apple-touch-icon', href: '/apple-touch-icon.png' },
                { rel: 'preconnect', href: 'https://fonts.googleapis.com' },
                { rel: 'preconnect', href: 'https://fonts.gstatic.com', crossorigin: 'anonymous' },
                {
                    rel: 'stylesheet',
                    href: 'https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&family=Playfair+Display:wght@700&display=swap',
                },
            ],
            meta: [{ name: 'theme-color', content: '#0ea5e9' }],
        },
    },

    runtimeConfig: {
        public: {
            siteUrl: 'http://localhost:3000',
            siteName: '万寻导航',
        },
    },

    nitro: {
        preset: 'cloudflare_module',
        cloudflare: {
            deployConfig: true,
            nodeCompat: true,
            wrangler: {
                name: 'site-nav',
                vars: {
                    NUXT_PUBLIC_SITE_URL: 'https://wanfind.com',
                },
                routes: [
                    {
                        pattern: 'wanfind.com',
                        custom_domain: true,
                    },
                    {
                        pattern: 'www.wanfind.com',
                        custom_domain: true,
                    },
                ],
            },
        },
    },

    typescript: {
        strict: true,
    },
});
