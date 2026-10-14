<script setup lang="ts">
import type { IconName } from '~/components/common/AppIcon.vue'

export interface CategoryNavItem {
  id: string
  title: string
  icon: IconName
}

const props = defineProps<{
  items: CategoryNavItem[]
}>()

const activeId = ref(props.items[0]?.id ?? '')

/** Ignore scroll-spy briefly after a nav click (smooth scroll in progress). */
let clickLockUntil = 0
let spyRaf = 0

/** Offset under sticky search / page chrome — section at this line is "active". */
function spyOffsetPx() {
  return 96
}

function updateActiveFromScroll() {
  if (performance.now() < clickLockUntil) {
    return
  }

  const offset = spyOffsetPx()
  let current = props.items[0]?.id ?? ''

  // Sections are in document order: last one whose top has crossed the spy
  // line is the category currently occupying the top of the content area.
  for (const item of props.items) {
    const el = document.getElementById(item.id)
    if (!el) {
      continue
    }
    if (el.getBoundingClientRect().top - offset <= 0) {
      current = item.id
    }
  }

  if (current && current !== activeId.value) {
    activeId.value = current
  }
}

function onScrollOrResize() {
  if (spyRaf) {
    return
  }
  spyRaf = window.requestAnimationFrame(() => {
    spyRaf = 0
    updateActiveFromScroll()
  })
}

function scrollToSection(id: string) {
  activeId.value = id
  const el = document.getElementById(id)
  if (!el) {
    return
  }
  clickLockUntil = performance.now() + 600
  el.scrollIntoView({ behavior: 'smooth', block: 'start' })
}

onMounted(() => {
  updateActiveFromScroll()
  window.addEventListener('scroll', onScrollOrResize, { passive: true })
  window.addEventListener('scrollend', updateActiveFromScroll, { passive: true })
  window.addEventListener('resize', onScrollOrResize, { passive: true })

  onBeforeUnmount(() => {
    window.removeEventListener('scroll', onScrollOrResize)
    window.removeEventListener('scrollend', updateActiveFromScroll)
    window.removeEventListener('resize', onScrollOrResize)
    if (spyRaf) {
      window.cancelAnimationFrame(spyRaf)
      spyRaf = 0
    }
  })
})
</script>

<template>
  <!--
    display:contents lets these children join the parent flex row,
    so the aside stretches with the content column and CSS sticky works smoothly.
  -->
  <div class="contents">
    <!-- Mobile chips -->
    <nav
      class="mb-4 -mx-1 overflow-x-auto px-1 py-2 lg:hidden"
      aria-label="分类导航"
    >
      <div class="flex w-max gap-2">
        <button
          v-for="item in items"
          :key="`m-${item.id}`"
          type="button"
          class="inline-flex shrink-0 items-center gap-1.5 rounded-full px-3 py-1.5 text-xs font-medium backdrop-blur-md transition"
          :class="activeId === item.id
            ? 'bg-white text-sky-700 shadow'
            : 'bg-white/25 text-white/90 ring-1 ring-white/30 hover:bg-white/40'"
          @click="scrollToSection(item.id)"
        >
          <AppIcon
            :name="item.icon"
            class="h-3.5 w-3.5"
          />
          {{ item.title }}
        </button>
      </div>
    </nav>

    <!-- Desktop sticky rail: aside is the tall flex item; sticky panel is its child -->
    <aside class="relative hidden w-48 shrink-0 lg:block xl:w-52">
      <div
        class="sticky top-[4.75rem] z-30 max-h-[calc(100svh-5.75rem)] overflow-y-auto rounded-2xl bg-white/95 p-3 shadow-lg shadow-sky-900/10 ring-1 ring-white/80 backdrop-blur-xl"
      >
        <p class="border-b border-zinc-200/80 px-2 pb-2.5 text-sm font-semibold text-zinc-800">
          分类导航
        </p>
        <ul class="mt-2 space-y-0.5">
          <li
            v-for="item in items"
            :key="item.id"
          >
            <button
              type="button"
              class="flex w-full items-center gap-2.5 rounded-xl px-2.5 py-2 text-left text-sm transition"
              :class="activeId === item.id
                ? 'bg-sky-100/90 font-semibold text-sky-700'
                : 'text-zinc-600 hover:bg-zinc-100/80 hover:text-zinc-900'"
              @click="scrollToSection(item.id)"
            >
              <span
                class="inline-flex h-7 w-7 shrink-0 items-center justify-center rounded-lg"
                :class="activeId === item.id ? 'bg-sky-200/70 text-sky-700' : 'bg-zinc-100 text-zinc-500'"
              >
                <AppIcon
                  :name="item.icon"
                  class="h-3.5 w-3.5"
                />
              </span>
              <span class="min-w-0 flex-1 truncate">{{ item.title }}</span>
              <span
                v-if="activeId === item.id"
                class="text-[10px] text-zinc-400"
                aria-hidden="true"
              >▸</span>
            </button>
          </li>
        </ul>
      </div>
    </aside>
  </div>
</template>
