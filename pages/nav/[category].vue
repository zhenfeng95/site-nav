<script setup lang="ts">
import { getNavigationCategory } from '~/utils/navigation'

const route = useRoute()
const slug = String(route.params.category)
const category = getNavigationCategory(slug)

if (!category) {
  throw createError({
    statusCode: 404,
    statusMessage: '分类不存在',
  })
}

const displayTitle = category.fullName || category.name

usePageSeo({
  title: displayTitle,
  description: category.description,
  path: `/nav/${category.slug}`,
})
</script>

<template>
  <AppContainer v-if="category" class="space-y-12 py-12 sm:py-16">
    <div>
      <PageHero
        eyebrow="Category"
        :title="displayTitle"
        :description="category.description"
      />
      <p class="mt-3 text-sm text-zinc-400">
        {{ category.items.length }} 个资源
      </p>
    </div>

    <section class="space-y-6">
      <SectionTitle
        title="资源入口"
        description="官方与常用站点，不确定的链接会标注待确认。"
      />
      <NavigationList :items="category.items" />
    </section>
  </AppContainer>
</template>
