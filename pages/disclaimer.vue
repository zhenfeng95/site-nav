<script setup lang="ts">
import { SITE_DISCLAIMER, SITE_NAME } from '~/utils/site'

usePageSeo({
  title: '免责声明',
  description: `${SITE_NAME} 内容免责声明。`,
  path: '/disclaimer',
})
</script>

<template>
  <AppContainer class="space-y-8 py-12 sm:py-16">
    <PageHero
      eyebrow="Disclaimer"
      title="免责声明"
      :description="SITE_DISCLAIMER"
    />
  </AppContainer>
</template>
