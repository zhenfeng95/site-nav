<template>
  <div class="min-h-screen bg-canvas dark:bg-canvas-dark">
    <header class="border-b border-zinc-200/70 bg-white/80 backdrop-blur dark:border-white/[0.06] dark:bg-black/30">
      <AppContainer>
        <div class="flex h-14 items-center justify-between gap-4">
          <div class="flex items-center gap-3">
            <NuxtLink
              to="/admin"
              class="text-sm font-semibold text-zinc-900 dark:text-zinc-50"
            >
              管理后台
            </NuxtLink>
            <span class="text-xs text-zinc-400">申请收录</span>
          </div>
          <div class="flex items-center gap-3">
            <NuxtLink
              to="/"
              class="text-xs text-zinc-500 hover:text-zinc-900 dark:hover:text-white"
            >
              返回前台
            </NuxtLink>
            <ClientOnly>
              <ThemeToggle />
            </ClientOnly>
          </div>
        </div>
      </AppContainer>
    </header>
    <main>
      <slot />
    </main>
  </div>
</template>
