<script setup lang="ts">
const now = ref(new Date())
let timer: ReturnType<typeof setInterval> | undefined

const timeText = computed(() => {
  const d = now.value
  const h = String(d.getHours()).padStart(2, '0')
  const m = String(d.getMinutes()).padStart(2, '0')
  const s = String(d.getSeconds()).padStart(2, '0')
  return `${h}:${m}:${s}`
})

const dateText = computed(() => {
  return new Intl.DateTimeFormat('zh-CN', {
    month: 'long',
    day: 'numeric',
    weekday: 'short',
  }).format(now.value)
})

onMounted(() => {
  now.value = new Date()
  timer = setInterval(() => {
    now.value = new Date()
  }, 1000)
})

onBeforeUnmount(() => {
  if (timer) {
    clearInterval(timer)
  }
})
</script>

<template>
  <div
    class="flex items-baseline gap-2 rounded-full bg-white/15 px-3 py-1.5 text-white backdrop-blur-md"
    aria-live="polite"
  >
    <time class="font-mono text-sm font-semibold tracking-wide tabular-nums sm:text-[15px]">
      {{ timeText }}
    </time>
    <span class="hidden text-xs text-white/80 sm:inline">
      {{ dateText }}
    </span>
  </div>
</template>
