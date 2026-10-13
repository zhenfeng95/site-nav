<script setup lang="ts">
import { getFaviconCandidates } from '~/utils/favicon'

interface SearchEngine {
  id: string
  name: string
  domain: string
  queryUrl: string
  placeholder: string
  accentClass?: string
}

const engines: SearchEngine[] = [
  {
    id: 'baidu',
    name: '百度',
    domain: 'www.baidu.com',
    queryUrl: 'https://www.baidu.com/s?wd=',
    placeholder: '输入关键词，百度一下',
  },
  {
    id: 'google',
    name: 'Google',
    domain: 'www.google.com',
    queryUrl: 'https://www.google.com/search?q=',
    placeholder: 'Search Google',
  },
  {
    id: 'bing',
    name: '必应',
    domain: 'www.bing.com',
    queryUrl: 'https://www.bing.com/search?q=',
    placeholder: '用必应搜索',
  },
  {
    id: 'duckduckgo',
    name: 'DuckDuckGo',
    domain: 'duckduckgo.com',
    queryUrl: 'https://duckduckgo.com/?q=',
    placeholder: 'Search privately',
  },
  {
    id: 'sogou',
    name: '搜狗',
    domain: 'www.sogou.com',
    queryUrl: 'https://www.sogou.com/web?query=',
    placeholder: '搜狗搜索',
  },
  {
    id: 'zhihu',
    name: '知乎搜索',
    domain: 'www.zhihu.com',
    queryUrl: 'https://www.zhihu.com/search?type=content&q=',
    placeholder: '在知乎搜索内容',
    accentClass: 'text-sky-600',
  },
  {
    id: 'bilibili',
    name: '哔哩哔哩',
    domain: 'www.bilibili.com',
    queryUrl: 'https://search.bilibili.com/all?keyword=',
    placeholder: '搜索哔哩哔哩视频',
    accentClass: 'text-pink-500',
  },
  {
    id: 'weibo',
    name: '微博搜索',
    domain: 'weibo.com',
    queryUrl: 'https://s.weibo.com/weibo?q=',
    placeholder: '在微博搜索',
    accentClass: 'text-orange-500',
  },
  {
    id: 'translate',
    name: '在线翻译',
    domain: 'fanyi.baidu.com',
    queryUrl: 'https://fanyi.baidu.com/#auto/zh/',
    placeholder: '输入要翻译的文本',
    accentClass: 'text-blue-600',
  },
]

const activeId = ref(engines[0]!.id)
const query = ref('')
const iconIndexById = reactive<Record<string, number>>({})

const activeEngine = computed(() => engines.find(e => e.id === activeId.value) ?? engines[0]!)

function engineIconCandidates(engine: SearchEngine) {
  return getFaviconCandidates(`https://${engine.domain}`, 32, undefined, engine.id)
}

function engineIcon(engine: SearchEngine) {
  const candidates = engineIconCandidates(engine)
  const index = iconIndexById[engine.id] ?? 0
  return candidates[index] ?? ''
}

function onEngineIconError(engine: SearchEngine) {
  const candidates = engineIconCandidates(engine)
  const next = (iconIndexById[engine.id] ?? 0) + 1
  if (next < candidates.length) {
    iconIndexById[engine.id] = next
  }
}

function tabClass(engine: SearchEngine) {
  if (activeId.value === engine.id) {
    return 'bg-white shadow-sm ring-2 ring-sky-500 text-sky-700'
  }
  return `bg-white/55 backdrop-blur-md hover:bg-white/80 ${engine.accentClass ?? 'text-zinc-700'}`
}

function submitSearch() {
  const q = query.value.trim()
  if (!q || !import.meta.client) {
    return
  }
  window.open(`${activeEngine.value.queryUrl}${encodeURIComponent(q)}`, '_blank', 'noopener,noreferrer')
}
</script>

<template>
  <div class="w-full">
    <div class="flex flex-wrap items-center justify-center gap-2">
      <button
        v-for="engine in engines"
        :key="engine.id"
        type="button"
        class="inline-flex items-center gap-1.5 rounded-full px-3 py-1.5 text-sm transition"
        :class="tabClass(engine)"
        @click="activeId = engine.id"
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
      class="mt-4 flex w-full items-stretch overflow-hidden rounded-full bg-white shadow-lg shadow-sky-900/10 ring-1 ring-black/5"
      @submit.prevent="submitSearch"
    >
      <label class="sr-only" for="home-search">搜索</label>
      <input
        id="home-search"
        v-model="query"
        type="search"
        autocomplete="off"
        enterkeyhint="search"
        class="min-w-0 flex-1 bg-transparent px-5 py-3.5 text-base text-zinc-800 outline-none placeholder:text-zinc-400"
        :placeholder="activeEngine.placeholder"
      >
      <button
        type="submit"
        class="m-1.5 inline-flex h-11 w-11 shrink-0 items-center justify-center rounded-full bg-sky-600 text-white transition hover:bg-sky-500"
        aria-label="搜索"
      >
        <AppIcon name="search" class="h-5 w-5" />
      </button>
    </form>
  </div>
</template>
