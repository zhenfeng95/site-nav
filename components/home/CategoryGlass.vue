<script setup lang="ts">
import type { IconName } from '~/components/common/AppIcon.vue'
import type { NavigationItem } from '~/types/navigation'

defineProps<{
  id?: string
  title: string
  icon: IconName
  items: NavigationItem[]
}>()
</script>

<template>
  <section
    :id="id"
    class="scroll-mt-20 rounded-[1.25rem] bg-white/80 p-4 shadow-lg shadow-sky-900/5 ring-1 ring-white/70 backdrop-blur-xl sm:p-5"
  >
    <header class="mb-3 flex items-center gap-2 text-zinc-700">
      <span class="inline-flex h-7 w-7 items-center justify-center rounded-lg bg-sky-50 text-sky-600">
        <AppIcon :name="icon" class="h-4 w-4" />
      </span>
      <h2 class="text-sm font-semibold tracking-wide sm:text-base">
        {{ title }}
      </h2>
    </header>
    <div
      class="grid grid-cols-4 gap-x-1 gap-y-2 sm:grid-cols-6 md:grid-cols-8 lg:grid-cols-10"
    >
      <SiteTile
        v-for="item in items"
        :key="item.id"
        :item="item"
      />
    </div>
  </section>
</template>
