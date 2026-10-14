<script setup lang="ts">
import type { IconName } from '~/components/common/AppIcon.vue'
import type { CategoryNavItem } from '~/components/home/CategorySideNav.vue'
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
const searchStuck = ref(false)
const searchInFlow = ref<HTMLElement | null>(null)

/**
 * Lock only delays *showing* the float (anti-flicker).
 * Hiding must never wait — fast fling-to-top used to keep the float up
 * during ENTER_LOCK while the hero was already visible.
 */
let stickLockUntil = 0
const ENTER_LOCK_MS = 320

const navItems = computed<CategoryNavItem[]>(() => {
  const items: CategoryNavItem[] = []
  if (featuredItems.length) {
    items.push({
      id: 'section-featured',
      title: '常用导航',
      icon: 'star',
    })
  }
  for (const category of categories) {
    items.push({
      id: `section-${category.slug}`,
      title: category.name,
      icon: category.icon as IconName,
    })
  }
  return items
})

function updateSearchStuck() {
  const el = searchInFlow.value
  if (!el) {
    return
  }

  const rect = el.getBoundingClientRect()
  const heroVisible = rect.bottom > 0 && rect.top < window.innerHeight
  const fullyAbove = rect.bottom <= 0

  // Highest priority: if hero search is on screen, float must be off.
  // This path ignores the enter-lock (critical for fast scroll-to-top).
  if (heroVisible) {
    if (searchStuck.value) {
      searchStuck.value = false
    }
    return
  }

  if (performance.now() < stickLockUntil) {
    return
  }

  if (fullyAbove && !searchStuck.value) {
    searchStuck.value = true
    stickLockUntil = performance.now() + ENTER_LOCK_MS
  }
}

onMounted(() => {
  updateSearchStuck()

  const el = searchInFlow.value
  // IO still fires when the hero crosses the viewport during momentum scrolls
  // where scroll events can be sparse (esp. fast fling-to-top on mobile).
  const observer = el
    ? new IntersectionObserver(() => updateSearchStuck(), {
        threshold: [0, 0.01, 0.1, 1],
      })
    : null
  if (el && observer) {
    observer.observe(el)
  }

  // Sync (no rAF): unstick must run in the same turn as the scroll sample.
  window.addEventListener('scroll', updateSearchStuck, { passive: true })
  window.addEventListener('scrollend', updateSearchStuck, { passive: true })
  window.addEventListener('resize', updateSearchStuck, { passive: true })

  onBeforeUnmount(() => {
    observer?.disconnect()
    window.removeEventListener('scroll', updateSearchStuck)
    window.removeEventListener('scrollend', updateSearchStuck)
    window.removeEventListener('resize', updateSearchStuck)
  })
})
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

      <!-- Hero search — original style, scrolls with the page. -->
      <div
        ref="searchInFlow"
        class="pb-1"
      >
        <SearchPanel />
      </div>

      <!-- Floating compact bar — separate fixed box, full-bleed. -->
      <Teleport to="body">
        <Transition
          enter-active-class="transition-transform duration-300 ease-[cubic-bezier(0.22,1,0.36,1)]"
          enter-from-class="-translate-y-full"
          enter-to-class="translate-y-0"
          leave-active-class="duration-0"
          leave-from-class="opacity-0"
          leave-to-class="opacity-0"
        >
          <div
            v-if="searchStuck"
            class="fixed inset-x-0 top-0 z-50 border-b border-zinc-200/80 bg-white px-4 py-3 shadow-sm will-change-transform sm:px-6 lg:px-8"
          >
            <SearchPanel
              :show-tabs="false"
              compact
            />
          </div>
        </Transition>
      </Teleport>

      <div class="mt-8 flex flex-col lg:mt-10 lg:flex-row lg:items-stretch lg:gap-5">
        <CategorySideNav :items="navItems" />

        <div class="min-w-0 flex-1 space-y-4 sm:space-y-5">
          <CategoryGlass
            v-if="featuredItems.length"
            id="section-featured"
            title="常用导航"
            icon="star"
            :items="featuredItems"
          />

          <CategoryGlass
            v-for="category in categories"
            :id="`section-${category.slug}`"
            :key="category.id"
            :title="category.name"
            :icon="category.icon as IconName"
            :items="category.items"
          />
        </div>
      </div>
    </div>
  </div>
</template>
