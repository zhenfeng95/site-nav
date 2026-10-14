export const SITE_NAME = '万寻导航';
export const SITE_NAME_EN = 'Wanfind';
export const SITE_DOMAIN = 'wanfind.com';
export const SITE_URL = `https://${SITE_DOMAIN}`;
export const SITE_TAGLINE = '精选站点导航 · 分类整理常用入口';
export const SITE_HERO_INTRO = '按主题整理常用网站入口，方便快速找到官方地址与常用工具。';
export const SITE_DESCRIPTION = '站点导航按分类整理 AI、开发、效率、设计与社交等常用站点入口，帮助你更快找到可靠官网与工具。';
export const SITE_DISCLAIMER = '本站内容仅用于信息整理与学习交流；外部链接指向第三方站点，访问与使用请以各站官方说明为准。';
export const SITE_CONTACT_EMAIL = 'zen@wanfind.com';

export interface NavLink {
    label: string;
    to: string;
}

export const footerAboutLinks: NavLink[] = [
    { label: '关于我们', to: '/about' },
    { label: '申请收录', to: '/apply' },
    { label: '免责声明', to: '/disclaimer' },
    { label: '隐私政策', to: '/privacy' },
    { label: '联系我们', to: '/contact' },
];

export const homeSeo = {
    title: '万寻导航｜发现优质网站与实用工具',
    description: SITE_DESCRIPTION,
};
