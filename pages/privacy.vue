<script setup lang="ts">
import { SITE_NAME } from '~/utils/site'

usePageSeo({
  title: '隐私政策',
  description: `${SITE_NAME} 隐私政策说明。`,
  path: '/privacy',
})
</script>

<template>
  <AppContainer class="space-y-8 py-12 sm:py-16">
    <PageHero
      eyebrow="Privacy"
      title="隐私政策"
      description="本站当前为静态导航内容站点，默认不收集可识别个人身份的表单数据。"
    />
    <div class="max-w-2xl space-y-4 text-sm leading-7 text-zinc-600 dark:text-zinc-300">
      <p>
        若后续接入分析或第三方服务，将在本页补充说明收集范围与用途。
      </p>
      <p>
        点击站外链接将离开本站，其隐私政策以目标站点为准。
      </p>
    </div>
  </AppContainer>
</template>
