export type NavigationIcon =
  | 'ai'
  | 'dev'
  | 'design'
  | 'productivity'
  | 'news'
  | 'infra'
  | 'analytics'
  | 'webmaster'
  | 'cloud'

export interface NavigationItem {
  id: string
  name: string
  description: string
  url: string
  /** Optional explicit icon when favicon services miss the site. */
  iconUrl?: string
  tags: string[]
  officialUrlConfirmed: boolean
  featured?: boolean
  updatedAt?: string
}

export interface NavigationCategory {
  id: string
  slug: string
  name: string
  /** 详情页标题；未设置时与 name 相同 */
  fullName?: string
  description: string
  icon: NavigationIcon
  items: NavigationItem[]
}
