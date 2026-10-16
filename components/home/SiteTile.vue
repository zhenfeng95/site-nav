<script setup lang="ts">
import type { NavigationItem } from '~/types/navigation'
import { getFaviconCandidates } from '~/utils/favicon'

const props = defineProps<{
  item: NavigationItem
}>()

const assetCdn = useAssetCdn()
const candidates = computed(() =>
  getFaviconCandidates(props.item.url, 64, props.item.iconUrl, props.item.id, assetCdn.value),
)
const candidateIndex = ref(0)

const favicon = computed(() => candidates.value[candidateIndex.value] ?? '')
const showImage = computed(() => Boolean(favicon.value) && candidateIndex.value < candidates.value.length)

function onImgError() {
  if (candidateIndex.value < candidates.value.length - 1) {
    candidateIndex.value += 1
    return
  }
  candidateIndex.value = candidates.value.length
}

/** Handle cached images whose load event may fire before the Vue listener is attached. */
function bindImg(el: Element | null) {
  if (!(el instanceof HTMLImageElement)) {
    return
  }
  if (el.complete && el.naturalWidth === 0) {
    onImgError()
  }
}
</script>

<template>
  <a
    :href="item.url"
    target="_blank"
    rel="noreferrer noopener"
    class="group flex flex-col items-center gap-2 rounded-xl px-1 py-2 text-center transition hover:-translate-y-0.5"
    :title="item.description"
  >
    <span
      class="relative flex h-11 w-11 items-center justify-center overflow-hidden rounded-xl bg-white shadow-sm ring-1 ring-black/5 transition group-hover:shadow-md sm:h-12 sm:w-12"
    >
      <span
        class="flex h-7 w-7 items-center justify-center rounded-lg bg-gradient-to-br from-sky-500 to-cyan-600 text-sm font-semibold text-white"
        aria-hidden="true"
      >
        {{ item.name.slice(0, 1) }}
      </span>
      <img
        v-if="showImage"
        :key="favicon"
        :ref="bindImg"
        :src="favicon"
        :alt="item.name"
        width="28"
        height="28"
        class="absolute h-7 w-7 bg-white object-contain"
        loading="lazy"
        decoding="async"
        referrerpolicy="no-referrer"
        @error="onImgError"
      >
    </span>
    <span class="line-clamp-1 max-w-[4.5rem] text-xs text-zinc-700 sm:max-w-[5.5rem] sm:text-[13px]">
      {{ item.name }}
    </span>
  </a>
</template>
