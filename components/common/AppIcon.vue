<script setup lang="ts">
export type IconName =
  | 'logo'
  | 'menu'
  | 'close'
  | 'sun'
  | 'moon'
  | 'arrow-right'
  | 'external'
  | 'search'
  | 'star'
  | 'ai'
  | 'dev'
  | 'design'
  | 'productivity'
  | 'news'
  | 'infra'
  | 'analytics'
  | 'webmaster'
  | 'cloud'
  | 'video'
  | 'music'

defineProps<{
  name: IconName
}>()
</script>

<template>
  <svg
    xmlns="http://www.w3.org/2000/svg"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    stroke-width="1.6"
    stroke-linecap="round"
    stroke-linejoin="round"
    aria-hidden="true"
  >
    <g v-if="name === 'logo'">
      <path d="M12 3.5 18 12l-6 8.5L6 12l6-8.5Z" />
      <circle cx="12" cy="12" r="1.2" fill="currentColor" stroke="none" />
    </g>
    <g v-else-if="name === 'menu'">
      <path d="M4 7h16M4 12h16M4 17h16" />
    </g>
    <g v-else-if="name === 'close'">
      <path d="M6 6l12 12M18 6 6 18" />
    </g>
    <g v-else-if="name === 'sun'">
      <circle cx="12" cy="12" r="4" />
      <path d="M12 3v1.5M12 19.5V21M4.9 4.9l1.1 1.1M18 18l1.1 1.1M3 12h1.5M19.5 12H21M4.9 19.1 6 18M18 6l1.1-1.1" />
    </g>
    <g v-else-if="name === 'moon'">
      <path d="M16.5 13.2A6.2 6.2 0 0 1 11 5.6 7 7 0 1 0 18.4 15a6.1 6.1 0 0 1-1.9-1.8Z" />
    </g>
    <g v-else-if="name === 'arrow-right'">
      <path d="M5 12h14M13 6l6 6-6 6" />
    </g>
    <g v-else-if="name === 'external'">
      <path d="M10 5H6.5A1.5 1.5 0 0 0 5 6.5v11A1.5 1.5 0 0 0 6.5 19h11a1.5 1.5 0 0 0 1.5-1.5V14M14 5h5v5M13 11l6-6" />
    </g>
    <g v-else-if="name === 'search'">
      <circle cx="11" cy="11" r="6.5" />
      <path d="m16 16 4 4" />
    </g>
    <g v-else-if="name === 'star'">
      <path d="m12 3.5 2.2 4.5 5 .7-3.6 3.5.9 5L12 14.8 7.5 17.2l.9-5L4.8 8.7l5-.7L12 3.5Z" />
    </g>
    <g v-else-if="name === 'ai'">
      <circle cx="12" cy="12" r="8.5" />
      <path d="M12 8v8M8.5 12h7" />
    </g>
    <g v-else-if="name === 'dev'">
      <path d="m8 9-3 3 3 3M16 9l3 3-3 3M13 7l-2 10" />
    </g>
    <g v-else-if="name === 'design'">
      <path d="M12 3.5 20 8v8l-8 4.5L4 16V8l8-4.5Z" />
      <circle cx="12" cy="12" r="2" />
    </g>
    <g v-else-if="name === 'productivity'">
      <rect x="4" y="5" width="16" height="14" rx="2" />
      <path d="M8 9h8M8 13h5" />
    </g>
    <g v-else-if="name === 'news'">
      <path d="M5 6h14v12H5zM8 10h5M8 14h8" />
    </g>
    <g v-else-if="name === 'infra'">
      <rect x="4" y="4" width="7" height="7" rx="1.5" />
      <rect x="13" y="4" width="7" height="7" rx="1.5" />
      <rect x="4" y="13" width="7" height="7" rx="1.5" />
      <rect x="13" y="13" width="7" height="7" rx="1.5" />
    </g>
    <g v-else-if="name === 'analytics'">
      <path d="M4 19V5M4 19h16" />
      <path d="M8 16v-4M12 16V8M16 16v-6M20 16v-9" />
    </g>
    <g v-else-if="name === 'webmaster'">
      <circle cx="12" cy="12" r="3" />
      <path d="M12 3v2.5M12 18.5V21M3 12h2.5M18.5 12H21M5.6 5.6l1.8 1.8M16.6 16.6l1.8 1.8M5.6 18.4l1.8-1.8M16.6 7.4l1.8-1.8" />
    </g>
    <g v-else-if="name === 'cloud'">
      <path d="M7.5 18h9.2A3.8 3.8 0 0 0 20 12.8a4.2 4.2 0 0 0-4-3.1 5.2 5.2 0 0 0-9.8 1.7A3.6 3.6 0 0 0 7.5 18Z" />
    </g>
    <g v-else-if="name === 'video'">
      <rect x="3.5" y="6" width="17" height="12" rx="2" />
      <path d="m10 10 4 2-4 2V10Z" fill="currentColor" stroke="none" />
      <path d="M8 20h8" />
    </g>
    <g v-else-if="name === 'music'">
      <path d="M9 18.5a2.5 2.5 0 1 1-2.5-2.5" />
      <path d="M16.5 16.5a2.5 2.5 0 1 1-2.5-2.5" />
      <path d="M11.5 16V6.5l7.5-1.5V13" />
    </g>
  </svg>
</template>
