<script setup lang="ts">
import { SITE_NAME } from '~/utils/site';

const logoSrc = assetUrl('/logo.png');
const navBgStyle = computed(() => ({
    backgroundImage: `url('${assetUrl('/images/nav-bg.jpg')}')`,
}));
</script>

<template>
    <div class="home-layout relative min-h-screen">
        <div
            class="pointer-events-none fixed inset-0 -z-10 bg-cover bg-center bg-no-repeat"
            :style="navBgStyle"
            aria-hidden="true"
        />
        <!-- Solid tint only: full-viewport backdrop-blur forces expensive repaints while scrolling. -->
        <div class="pointer-events-none fixed inset-0 -z-10 bg-sky-900/30" aria-hidden="true" />

        <header class="relative z-40">
            <div class="mx-auto flex h-14 max-w-6xl items-center justify-between gap-4 px-4 sm:px-6 lg:px-8">
                <NuxtLink
                    to="/"
                    class="inline-flex items-center gap-2 rounded-full bg-white/20 px-3 py-1.5 text-sm font-semibold text-white backdrop-blur-md transition hover:bg-white/30"
                >
                    <img :src="logoSrc" alt="" width="28" class="h-6 w-6 shrink-0 rounded-md object-cover" />
                    {{ SITE_NAME }}
                </NuxtLink>

                <ClientOnly>
                    <HomeClock />
                    <template #fallback>
                        <div class="h-8 w-24 rounded-full bg-white/10 sm:w-40" aria-hidden="true" />
                    </template>
                </ClientOnly>
            </div>
        </header>

        <main class="flex-1">
            <slot />
        </main>

        <footer class="border-t border-white/15 bg-black/20 py-6 text-center backdrop-blur-md">
            <p class="text-xs text-white/70">
                © 2026 {{ SITE_NAME }} ·
                <NuxtLink to="/apply" class="underline-offset-2 hover:underline">申请收录</NuxtLink>
                ·
                <NuxtLink to="/disclaimer" class="underline-offset-2 hover:underline">免责声明</NuxtLink>
                ·
                <NuxtLink to="/about" class="underline-offset-2 hover:underline">关于</NuxtLink>
            </p>
        </footer>
    </div>
</template>
