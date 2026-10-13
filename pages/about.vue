<script setup lang="ts">
import { SITE_DESCRIPTION, SITE_NAME } from '~/utils/site'

usePageSeo({
  title: '关于我们',
  description: `${SITE_NAME} 介绍：站点定位、内容组织方式与使用说明。`,
  path: '/about',
})
</script>

<template>
  <AppContainer class="space-y-8 py-12 sm:py-16">
    <PageHero
      eyebrow="About"
      title="关于本站"
      :description="SITE_DESCRIPTION"
    />
    <div class="prose-like max-w-2xl space-y-4 text-sm leading-7 text-zinc-600 dark:text-zinc-300">
      <p>
        本项目参考 invest-nav 的技术栈与部署方式搭建：Nuxt 3、Tailwind CSS，并通过 Cloudflare Workers 发布。
      </p>
      <p>
        导航数据放在 <code class="rounded bg-zinc-100 px-1.5 py-0.5 text-xs dark:bg-white/10">data/navigation.json</code>，
        页面通过 <code class="rounded bg-zinc-100 px-1.5 py-0.5 text-xs dark:bg-white/10">utils/navigation.ts</code> 读取，便于后续扩展分类与站点。
      </p>
    </div>
  </AppContainer>
</template>
