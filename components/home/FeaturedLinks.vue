<script setup lang="ts">
import { getFeaturedNavigationItems } from '~/utils/navigation'

const featured = getFeaturedNavigationItems(6)
</script>

<template>
  <section class="space-y-6">
    <SectionTitle
      title="常用入口"
      description="从示例数据里挑出的常用站点，可在 data/navigation.json 中增删改。"
    />
    <div class="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
      <a
        v-for="item in featured"
        :key="item.id"
        :href="item.url"
        target="_blank"
        rel="noreferrer noopener"
        class="card card-hover flex flex-col p-5"
      >
        <div class="flex items-start justify-between gap-3">
          <h3 class="text-base font-semibold tracking-tight text-zinc-900 dark:text-zinc-50">
            {{ item.name }}
          </h3>
          <AppIcon name="external" class="mt-0.5 h-3.5 w-3.5 shrink-0 text-zinc-400" />
        </div>
        <p class="mt-2 flex-1 text-sm leading-6 text-zinc-500 dark:text-zinc-400">
          {{ item.description }}
        </p>
        <span class="mt-4 text-xs text-zinc-400">
          {{ item.categoryName }}
        </span>
      </a>
    </div>
  </section>
</template>
