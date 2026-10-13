<script setup lang="ts">
import { SITE_HERO_INTRO, SITE_NAME } from '~/utils/site'

function scrollToContent() {
  if (!import.meta.client) {
    return
  }
  document.getElementById('home-content')?.scrollIntoView({ behavior: 'smooth' })
}
</script>

<template>
  <section
    class="hero-screen relative flex min-h-[calc(100svh-4rem)] flex-col items-center justify-center overflow-hidden px-4 py-16 text-center sm:px-6"
  >
    <div class="hero-content relative z-10 mx-auto flex max-w-3xl flex-col items-center">
      <h1 class="mt-8 font-serif text-6xl font-bold leading-[1.05] tracking-tight text-white sm:mt-10 sm:text-7xl lg:text-8xl">
        {{ SITE_NAME }}
      </h1>

      <p class="mt-8 max-w-md text-base leading-8 text-zinc-200 sm:mt-10 sm:text-lg sm:leading-9">
        {{ SITE_HERO_INTRO }}
      </p>

      <div class="mt-10 flex flex-wrap items-center justify-center gap-3 sm:mt-12 sm:gap-4">
        <NuxtLink
          to="/nav"
          class="focus-ring inline-flex items-center justify-center rounded-full bg-accent px-6 py-3 text-sm font-semibold text-white transition hover:bg-accent-soft"
        >
          浏览导航
        </NuxtLink>
        <NuxtLink
          to="/about"
          class="focus-ring inline-flex items-center justify-center rounded-full border border-white/20 bg-transparent px-6 py-3 text-sm font-medium text-zinc-100 transition hover:border-white/40 hover:bg-white/5"
        >
          关于本站
        </NuxtLink>
      </div>
    </div>

    <button
      type="button"
      class="absolute bottom-6 left-1/2 z-10 -translate-x-1/2 text-white/50 transition hover:text-white/80"
      aria-label="向下滚动"
      @click="scrollToContent"
    >
      <svg class="h-5 w-5" viewBox="0 0 20 20" fill="none" aria-hidden="true">
        <path d="M5 7.5 L10 12.5 L15 7.5" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round" />
      </svg>
    </button>
  </section>
</template>

<style scoped>
.hero-screen {
  background:
    radial-gradient(ellipse 80% 60% at 50% -10%, rgba(111, 143, 130, 0.35), transparent 55%),
    linear-gradient(165deg, #0f1412 0%, #1a2420 45%, #0b0d10 100%);
}
</style>
