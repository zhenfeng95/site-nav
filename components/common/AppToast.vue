<script setup lang="ts">
const { toasts, dismiss } = useToast()

function typeClass(type: string) {
  if (type === 'success') {
    return 'border-emerald-200 bg-emerald-50 text-emerald-800'
  }
  if (type === 'error') {
    return 'border-rose-200 bg-rose-50 text-rose-800'
  }
  return 'border-sky-200 bg-sky-50 text-sky-800'
}
</script>

<template>
  <div
    class="pointer-events-none fixed inset-x-0 top-4 z-[100] flex flex-col items-center gap-2 px-4"
    aria-live="polite"
  >
    <TransitionGroup
      name="toast"
      tag="div"
      class="flex w-full max-w-sm flex-col items-stretch gap-2"
    >
      <div
        v-for="item in toasts"
        :key="item.id"
        class="pointer-events-auto rounded-xl border px-4 py-3 text-sm shadow-lg backdrop-blur"
        :class="typeClass(item.type)"
        role="status"
        @click="dismiss(item.id)"
      >
        {{ item.message }}
      </div>
    </TransitionGroup>
  </div>
</template>

<style scoped>
.toast-enter-active,
.toast-leave-active {
  transition: all 0.22s ease;
}
.toast-enter-from,
.toast-leave-to {
  opacity: 0;
  transform: translateY(-8px);
}
</style>
