import { getFaviconCandidates } from '~/utils/favicon'

export interface SearchEngine {
  id: string
  name: string
  domain: string
  queryUrl: string
  placeholder: string
  accentClass?: string
}

export const HOME_SEARCH_ENGINES: SearchEngine[] = [
  {
    id: 'baidu',
    name: '百度',
    domain: 'www.baidu.com',
    queryUrl: 'https://www.baidu.com/s?wd=',
    placeholder: '输入关键词搜索…',
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

export function useHomeSearch() {
  const activeId = useState<string>('home-search-engine', () => HOME_SEARCH_ENGINES[0]!.id)
  const query = useState<string>('home-search-query', () => '')
  const iconIndexById = useState<Record<string, number>>('home-search-icon-index', () => ({}))
  const assetCdn = useAssetCdn()

  const engines = HOME_SEARCH_ENGINES
  const activeEngine = computed(
    () => engines.find(e => e.id === activeId.value) ?? engines[0]!,
  )

  function engineIconCandidates(engine: SearchEngine) {
    return getFaviconCandidates(
      `https://${engine.domain}`,
      32,
      undefined,
      engine.id,
      assetCdn.value,
    )
  }

  function engineIcon(engine: SearchEngine) {
    const candidates = engineIconCandidates(engine)
    const index = iconIndexById.value[engine.id] ?? 0
    return candidates[index] ?? ''
  }

  function onEngineIconError(engine: SearchEngine) {
    const candidates = engineIconCandidates(engine)
    const next = (iconIndexById.value[engine.id] ?? 0) + 1
    if (next < candidates.length) {
      iconIndexById.value = { ...iconIndexById.value, [engine.id]: next }
    }
  }

  function selectEngine(id: string) {
    activeId.value = id
  }

  function submitSearch() {
    const q = query.value.trim()
    if (!q || !import.meta.client) {
      return
    }
    window.open(`${activeEngine.value.queryUrl}${encodeURIComponent(q)}`, '_blank', 'noopener,noreferrer')
  }

  return {
    engines,
    activeId,
    query,
    activeEngine,
    engineIcon,
    onEngineIconError,
    selectEngine,
    submitSearch,
  }
}
