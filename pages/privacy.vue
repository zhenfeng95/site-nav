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
      description="本站为导航内容站点，不提供注册或登录，也不收集可识别个人身份的表单数据。"
    />
    <div class="max-w-2xl space-y-4 text-sm leading-7 text-zinc-600 dark:text-zinc-300">
      <p>
        本站使用
        <a
          href="https://www.51.la/"
          class="font-medium text-accent underline decoration-accent/30 underline-offset-2"
          rel="noopener noreferrer"
          target="_blank"
        >51.la</a>
        统计页面访问量、来路、地域与设备等汇总数据，用于了解内容受欢迎程度与改进站点。浏览器会加载其统计脚本并向 51.la 发送与访问相关的技术信息（如页面地址、来源页、大致地区、设备与浏览器类型等）。我们未开启其屏幕录制功能。为减少境外访问超时，统计脚本仅在 Cloudflare 识别为中国大陆（CF-IPCountry 为 CN）的访问中加载；其它地区或无法识别时不加载。51.la 也可能使用 Cookie 或类似技术以区分访问会话；你可通过浏览器设置限制第三方 Cookie。具体处理方式以 51.la 相关说明与政策为准。
      </p>
      <p>
        点击站外链接将离开本站，其隐私政策以目标站点为准。
      </p>
    </div>
  </AppContainer>
</template>
