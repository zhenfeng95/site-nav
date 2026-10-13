<script setup lang="ts">
import { SITE_DESCRIPTION, SITE_NAME } from '~/utils/site';

usePageSeo({
    title: '关于我们',
    description: `${SITE_NAME} 介绍：站点定位、内容组织方式与使用说明。`,
    path: '/about',
});
</script>

<template>
    <AppContainer class="space-y-8 py-12 sm:py-16">
        <PageHero eyebrow="About" title="关于本站" :description="SITE_DESCRIPTION" />
    </AppContainer>
</template>
