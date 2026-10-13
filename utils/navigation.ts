import navigationData from '~/data/navigation.json'
import type { NavigationCategory, NavigationItem } from '~/types/navigation'

const categories = navigationData.categories as NavigationCategory[]

export interface NavigationGroup {
  id: string
  title: string
  description: string
  slugs: string[]
}

export const navigationGroups: NavigationGroup[] = [
  {
    id: 'work',
    title: '工作与开发',
    description: 'AI、开发与效率相关入口。',
    slugs: ['ai', 'dev', 'productivity'],
  },
  {
    id: 'create',
    title: '设计与创作',
    description: '设计工具与素材相关入口。',
    slugs: ['design'],
  },
  {
    id: 'media',
    title: '影视与音乐',
    description: '视频、直播与在线音乐入口。',
    slugs: ['video', 'music'],
  },
  {
    id: 'life',
    title: '社交与工具',
    description: '社交平台与实用在线工具。',
    slugs: ['social', 'tools', 'storage', 'analytics', 'webmaster'],
  },
]

const shortDescriptions: Record<string, string> = {
  ai: '对话、写作与开发相关 AI 入口',
  dev: '代码托管、包管理与部署入口',
  productivity: '笔记、任务与协作入口',
  design: '界面设计与图标资源入口',
  social: '社交、问答与邮箱入口',
  tools: '翻译、查询与格式化工具',
  storage: '百度、阿里、夸克、天翼等网盘入口',
  video: '影视、短视频与直播平台入口',
  music: '网易云、QQ 音乐与酷狗入口',
  analytics: '网站 PV / UV 与流量分析入口',
  webmaster: '搜索引擎站长与收录平台入口',
}

export function getNavigationCategories(): NavigationCategory[] {
  return categories.map(category => ({
    ...category,
    items: [...category.items],
  }))
}

export function getNavigationCategory(slug: string): NavigationCategory | undefined {
  const category = categories.find(item => item.slug === slug)
  if (!category) {
    return undefined
  }

  return {
    ...category,
    items: [...category.items],
  }
}

export function getNavigationShortDescription(slug: string): string {
  return shortDescriptions[slug]
    ?? getNavigationCategory(slug)?.description
    ?? ''
}

export function getGroupedNavigationCategories(): Array<
  NavigationGroup & { categories: NavigationCategory[] }
> {
  const bySlug = new Map(getNavigationCategories().map(item => [item.slug, item]))

  return navigationGroups.map(group => ({
    ...group,
    categories: group.slugs
      .map(slug => bySlug.get(slug))
      .filter((item): item is NavigationCategory => Boolean(item)),
  }))
}

export function getFeaturedNavigationItems(limit = 6): Array<NavigationItem & { categoryName: string, categorySlug: string }> {
  return categories
    .flatMap(category => category.items
      .filter(item => item.featured)
      .map(item => ({
        ...item,
        categoryName: category.name,
        categorySlug: category.slug,
      })))
    .sort((a, b) => (b.updatedAt ?? '').localeCompare(a.updatedAt ?? ''))
    .slice(0, limit)
}

export function getNavigationPath(slug?: string): string {
  if (!slug) {
    return '/nav'
  }
  return `/nav/${slug}`
}

export function sortNavigationItems(items: NavigationItem[]): NavigationItem[] {
  return [...items].sort((a, b) => {
    const featuredDiff = Number(Boolean(b.featured)) - Number(Boolean(a.featured))
    if (featuredDiff !== 0) {
      return featuredDiff
    }
    return (b.updatedAt ?? '').localeCompare(a.updatedAt ?? '')
  })
}

export function getFooterCategoryLinks() {
  return getNavigationCategories().map(category => ({
    label: category.name,
    to: getNavigationPath(category.slug),
  }))
}
