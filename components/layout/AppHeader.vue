<script setup lang="ts">
import { SITE_NAME } from '~/utils/site'

const logoSrc = assetUrl('/logo.png')
</script>

<template>
  <header
    class="sticky top-0 z-50 border-b border-zinc-200/70 bg-canvas/80 backdrop-blur-md dark:border-white/[0.06] dark:bg-canvas-dark/80"
  >
    <AppContainer>
      <div class="flex h-16 items-center justify-between gap-4">
        <NuxtLink to="/" class="flex min-w-0 items-center gap-2 text-zinc-900 dark:text-zinc-50">
          <img
            :src="logoSrc"
            alt=""
            width="28"
            class="h-7 w-7 shrink-0 rounded-sm object-cover"
          >
          <span class="truncate text-sm font-semibold tracking-tight">{{ SITE_NAME }}</span>
        </NuxtLink>

        <ClientOnly>
          <ThemeToggle />
          <template #fallback>
            <div class="h-9 w-9 rounded-full border border-zinc-200/80 dark:border-white/10" />
          </template>
        </ClientOnly>
      </div>
    </AppContainer>
  </header>
</template>
