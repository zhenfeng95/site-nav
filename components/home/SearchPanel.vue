<script setup lang="ts">
import type { SearchEngine } from '~/composables/useHomeSearch'

const props = withDefaults(defineProps<{
  /** Show the engine tab row */
  showTabs?: boolean
  /** Show the search form */
  showForm?: boolean
  /** Compact bar: engine chip + input + 搜索（sticky 用，高度保持稳定） */
  compact?: boolean
}>(), {
  showTabs: true,
  showForm: true,
  compact: false,
})

const {
  engines,
  activeId,
  query,
  activeEngine,
  engineIcon,
  onEngineIconError,
  selectEngine,
  submitSearch,
} = useHomeSearch()

const engineMenuOpen = ref(false)
const isCompact = computed(() => Boolean(props.compact))
const inputId = computed(() => (isCompact.value ? 'home-search-bar' : 'home-search'))

watch(isCompact, (compact) => {
  if (!compact) {
    engineMenuOpen.value = false
  }
})

function tabClass(engine: SearchEngine) {
  if (activeId.value === engine.id) {
    return 'bg-white shadow-sm ring-2 ring-sky-500 text-sky-700'
  }
  return `bg-white/55 backdrop-blur-md hover:bg-white/80 ${engine.accentClass ?? 'text-zinc-700'}`
}

function onSelectEngine(id: string) {
  selectEngine(id)
  engineMenuOpen.value = false
}
</script>

<template>
  <div
    class="w-full"
    :class="isCompact ? 'mx-auto max-w-3xl' : ''"
  >
    <div
      v-if="showTabs"
      class="flex flex-wrap items-center justify-center gap-2"
      :class="showForm ? 'pb-4' : ''"
    >
      <button
        v-for="engine in engines"
        :key="engine.id"
        type="button"
        class="inline-flex items-center gap-1.5 rounded-full px-3 py-1.5 text-sm transition"
        :class="tabClass(engine)"
        @click="selectEngine(engine.id)"
      >
        <img
          v-if="engineIcon(engine)"
          :key="engineIcon(engine)"
          :src="engineIcon(engine)"
          :alt="engine.name"
          width="16"
          height="16"
          class="h-4 w-4 rounded-sm"
          loading="lazy"
          referrerpolicy="no-referrer"
          @error="onEngineIconError(engine)"
        >
        {{ engine.name }}
      </button>
    </div>

    <form
      v-if="showForm"
      class="flex w-full items-center gap-2"
      @submit.prevent="submitSearch"
    >
      <div
        v-if="isCompact"
        class="relative shrink-0"
      >
        <button
          type="button"
          class="inline-flex h-10 items-center gap-1.5 rounded-full border border-zinc-200 bg-white px-3 text-sm text-zinc-700 transition hover:bg-zinc-50"
          :aria-expanded="engineMenuOpen"
          @click="engineMenuOpen = !engineMenuOpen"
        >
          <img
            v-if="engineIcon(activeEngine)"
            :src="engineIcon(activeEngine)"
            alt=""
            width="14"
            height="14"
            class="h-3.5 w-3.5 rounded-sm"
            referrerpolicy="no-referrer"
          >
          <span class="max-w-[6.5rem] truncate">{{ activeEngine.name }}</span>
          <span class="text-[10px] text-zinc-400">▾</span>
        </button>
        <div
          v-if="engineMenuOpen"
          class="absolute left-0 top-full z-50 mt-1 max-h-64 w-40 overflow-y-auto rounded-xl border border-zinc-200 bg-white py-1 shadow-lg"
        >
          <button
            v-for="engine in engines"
            :key="`compact-${engine.id}`"
            type="button"
            class="flex w-full items-center gap-2 px-3 py-2 text-left text-sm transition hover:bg-zinc-50"
            :class="activeId === engine.id ? 'bg-sky-50 text-sky-700' : 'text-zinc-700'"
            @click="onSelectEngine(engine.id)"
          >
            <img
              v-if="engineIcon(engine)"
              :src="engineIcon(engine)"
              alt=""
              width="14"
              height="14"
              class="h-3.5 w-3.5 rounded-sm"
              referrerpolicy="no-referrer"
              @error="onEngineIconError(engine)"
            >
            {{ engine.name }}
          </button>
        </div>
      </div>

      <div
        class="flex min-w-0 flex-1 items-stretch overflow-hidden rounded-full bg-white ring-1 ring-black/5"
        :class="isCompact ? 'shadow-sm shadow-sky-900/5' : 'shadow-lg shadow-sky-900/10'"
      >
        <label
          class="sr-only"
          :for="inputId"
        >搜索</label>
        <input
          :id="inputId"
          v-model="query"
          type="search"
          autocomplete="off"
          enterkeyhint="search"
          class="min-w-0 flex-1 bg-transparent px-5 text-zinc-800 outline-none placeholder:text-zinc-400"
          :class="isCompact ? 'py-2.5 text-sm' : 'py-3.5 text-base'"
          :placeholder="isCompact ? '输入关键词搜索…' : activeEngine.placeholder"
        >
        <button
          v-if="!isCompact"
          type="submit"
          class="m-1.5 inline-flex h-11 w-11 shrink-0 items-center justify-center rounded-full bg-sky-600 text-white transition hover:bg-sky-500"
          aria-label="搜索"
        >
          <AppIcon
            name="search"
            class="h-5 w-5"
          />
        </button>
      </div>

      <button
        v-if="isCompact"
        type="submit"
        class="inline-flex h-10 shrink-0 items-center justify-center rounded-full bg-gradient-to-r from-sky-500 to-indigo-500 px-5 text-sm font-semibold text-white shadow-sm transition hover:from-sky-400 hover:to-indigo-400"
      >
        搜索
      </button>
    </form>
  </div>
</template>
