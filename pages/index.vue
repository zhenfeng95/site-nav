<script setup lang="ts">
import type { IconName } from '~/components/common/AppIcon.vue'
import {
  getFeaturedNavigationItems,
  getNavigationCategories,
} from '~/utils/navigation'
import { SITE_NAME, SITE_TAGLINE } from '~/utils/site'

definePageMeta({
  layout: 'home',
})

useHomeSeo()

const categories = getNavigationCategories()
const featuredItems = getFeaturedNavigationItems(10)
</script>

<template>
  <div class="px-4 pb-16 pt-6 sm:px-6 sm:pt-10 lg:px-8">
    <div class="mx-auto max-w-6xl">
      <header class="mb-8 text-center sm:mb-10">
        <h1 class="text-3xl font-bold tracking-tight text-white drop-shadow-md sm:text-4xl lg:text-5xl">
          {{ SITE_NAME }}
        </h1>
        <p class="mt-2 text-sm text-white/80 sm:text-base">
          {{ SITE_TAGLINE }}
        </p>
      </header>

      <SearchPanel />

      <div class="mt-8 space-y-4 sm:mt-10 sm:space-y-5">
        <CategoryGlass
          v-if="featuredItems.length"
          title="常用导航"
          icon="star"
          :items="featuredItems"
        />

        <CategoryGlass
          v-for="category in categories"
          :key="category.id"
          :title="category.name"
          :icon="category.icon as IconName"
          :items="category.items"
        />
      </div>
    </div>
  </div>
</template>
