<script setup lang="ts">
import { SITE_CONTACT_EMAIL, SITE_NAME } from '~/utils/site'

usePageSeo({
  title: '联系我们',
  description: `通过邮箱联系 ${SITE_NAME} 站点维护者。`,
  path: '/contact',
})
</script>

<template>
  <AppContainer class="space-y-8 py-12 sm:py-16">
    <PageHero
      eyebrow="Contact"
      title="联系我们"
      description="有合作、纠错或建议，欢迎发邮件。若希望网站被收录，请使用申请收录表单。"
    />
    <p class="text-sm text-zinc-600 dark:text-zinc-300">
      邮箱：
      <a
        :href="`mailto:${SITE_CONTACT_EMAIL}`"
        class="font-medium text-accent underline decoration-accent/30 underline-offset-2"
      >
        {{ SITE_CONTACT_EMAIL }}
      </a>
    </p>
    <p class="text-sm text-zinc-600 dark:text-zinc-300">
      <NuxtLink
        to="/apply"
        class="font-medium text-accent underline decoration-accent/30 underline-offset-2"
      >
        申请收录
      </NuxtLink>
    </p>
  </AppContainer>
</template>
