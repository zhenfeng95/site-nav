<script setup lang="ts">
import type { Submission, SubmissionStatus } from '~/types/submission'
import { getNavigationCategories } from '~/utils/navigation'

definePageMeta({
  layout: 'admin',
})

usePageSeo({
  title: '管理后台',
  description: '申请收录审核后台。',
  path: '/admin',
  noindex: true,
})

const categoryName = Object.fromEntries(
  getNavigationCategories().map(c => [c.slug, c.name]),
)

const password = ref('')
const loginError = ref('')
const loggingIn = ref(false)
const statusFilter = ref<SubmissionStatus | ''>('pending')
const actionError = ref('')
const busyId = ref('')

const { data: session, refresh: refreshSession } = await useFetch('/api/admin/session')

const listUrl = computed(() => {
  const q = statusFilter.value ? `?status=${statusFilter.value}` : ''
  return `/api/admin/submissions${q}`
})

const {
  data: listData,
  refresh: refreshList,
  error: listError,
  pending: listPending,
} = await useFetch<{ items: Submission[] }>(listUrl, {
  immediate: false,
  watch: false,
})

watch(
  () => session.value?.authenticated,
  async (ok) => {
    if (ok) {
      await refreshList()
    }
  },
  { immediate: true },
)

watch(statusFilter, async () => {
  if (session.value?.authenticated) {
    await refreshList()
  }
})

async function onLogin() {
  loginError.value = ''
  loggingIn.value = true
  try {
    await $fetch('/api/admin/login', {
      method: 'POST',
      body: { password: password.value },
    })
    password.value = ''
    await refreshSession()
    await refreshList()
  }
  catch (error: unknown) {
    const err = error as { data?: { message?: string }; message?: string }
    loginError.value = err?.data?.message || err?.message || '登录失败'
  }
  finally {
    loggingIn.value = false
  }
}

async function onLogout() {
  await $fetch('/api/admin/logout', { method: 'POST' })
  await refreshSession()
  listData.value = { items: [] }
}

async function setStatus(item: Submission, status: SubmissionStatus) {
  actionError.value = ''
  busyId.value = item.id
  try {
    await $fetch(`/api/admin/submissions/${item.id}`, {
      method: 'PATCH',
      body: { status, note: item.note },
    })
    await refreshList()
  }
  catch (error: unknown) {
    const err = error as { data?: { message?: string }; message?: string }
    actionError.value = err?.data?.message || err?.message || '更新失败'
  }
  finally {
    busyId.value = ''
  }
}

function statusLabel(status: SubmissionStatus) {
  if (status === 'pending') return '待审核'
  if (status === 'approved') return '已通过'
  return '已拒绝'
}
</script>

<template>
  <AppContainer class="space-y-8 py-10 sm:py-12">
    <div class="flex flex-wrap items-end justify-between gap-4">
      <div>
        <h1 class="text-2xl font-semibold tracking-tight text-zinc-900 dark:text-zinc-50">
          申请收录
        </h1>
        <p class="mt-2 text-sm text-zinc-500 dark:text-zinc-400">
          审核通过后，请手动更新 navigation.json 并部署。
        </p>
      </div>
      <button
        v-if="session?.authenticated"
        type="button"
        class="text-sm text-zinc-500 hover:text-zinc-900 dark:hover:text-white"
        @click="onLogout"
      >
        退出登录
      </button>
    </div>

    <form
      v-if="!session?.authenticated"
      class="max-w-sm space-y-4 rounded-2xl border border-zinc-200/80 bg-white p-6 dark:border-white/10 dark:bg-white/[0.03]"
      @submit.prevent="onLogin"
    >
      <label class="block text-sm font-medium text-zinc-800 dark:text-zinc-200">
        管理员密码
        <input
          v-model="password"
          type="password"
          required
          class="focus-ring mt-2 w-full rounded-xl border border-zinc-200 bg-white px-3 py-2.5 text-sm dark:border-white/10 dark:bg-white/[0.04]"
          autocomplete="current-password"
        >
      </label>
      <p
        v-if="loginError"
        class="text-sm text-rose-600"
      >
        {{ loginError }}
      </p>
      <button
        type="submit"
        class="focus-ring rounded-xl bg-accent px-4 py-2 text-sm font-medium text-white disabled:opacity-60"
        :disabled="loggingIn"
      >
        {{ loggingIn ? '登录中…' : '登录' }}
      </button>
    </form>

    <template v-else>
      <div class="flex flex-wrap items-center gap-2">
        <button
          v-for="option in [
            { value: '' as const, label: '全部' },
            { value: 'pending' as const, label: '待审核' },
            { value: 'approved' as const, label: '已通过' },
            { value: 'rejected' as const, label: '已拒绝' },
          ]"
          :key="option.label"
          type="button"
          class="rounded-lg px-3 py-1.5 text-sm transition"
          :class="statusFilter === option.value
            ? 'bg-zinc-900 text-white dark:bg-white dark:text-zinc-900'
            : 'bg-zinc-100 text-zinc-600 hover:bg-zinc-200 dark:bg-white/10 dark:text-zinc-300'"
          @click="statusFilter = option.value"
        >
          {{ option.label }}
        </button>
      </div>

      <p
        v-if="actionError || listError"
        class="text-sm text-rose-600"
      >
        {{ actionError || '加载失败，请刷新重试。' }}
      </p>

      <p
        v-if="listPending"
        class="text-sm text-zinc-500"
      >
        加载中…
      </p>

      <div
        v-else-if="!(listData?.items?.length)"
        class="rounded-2xl border border-dashed border-zinc-200 px-6 py-12 text-center text-sm text-zinc-500 dark:border-white/10"
      >
        暂无申请记录
      </div>

      <ul
        v-else
        class="space-y-4"
      >
        <li
          v-for="item in listData?.items"
          :key="item.id"
          class="rounded-2xl border border-zinc-200/80 bg-white p-5 dark:border-white/10 dark:bg-white/[0.03]"
        >
          <div class="flex flex-wrap items-start justify-between gap-3">
            <div class="min-w-0 space-y-1">
              <div class="flex flex-wrap items-center gap-2">
                <h2 class="text-base font-semibold text-zinc-900 dark:text-zinc-50">
                  {{ item.name }}
                </h2>
                <span class="rounded-md bg-zinc-100 px-2 py-0.5 text-xs text-zinc-600 dark:bg-white/10 dark:text-zinc-300">
                  {{ statusLabel(item.status) }}
                </span>
                <span class="rounded-md bg-zinc-100 px-2 py-0.5 text-xs text-zinc-600 dark:bg-white/10 dark:text-zinc-300">
                  {{ categoryName[item.category] || item.category }}
                </span>
              </div>
              <div class="flex items-start gap-2">
                <img
                  v-if="item.iconUrl"
                  :src="item.iconUrl"
                  alt=""
                  width="20"
                  height="20"
                  class="mt-0.5 h-5 w-5 rounded object-contain"
                >
                <a
                  :href="item.url"
                  target="_blank"
                  rel="noopener noreferrer"
                  class="break-all text-sm text-accent underline decoration-accent/30 underline-offset-2"
                >{{ item.url }}</a>
              </div>
              <p
                v-if="item.description"
                class="text-sm leading-6 text-zinc-600 dark:text-zinc-300"
              >
                {{ item.description }}
              </p>
              <p
                v-if="item.contact"
                class="text-xs text-zinc-500"
              >
                联系：{{ item.contact }}
              </p>
              <p class="text-xs text-zinc-400">
                提交于 {{ new Date(item.createdAt).toLocaleString('zh-CN') }}
              </p>
            </div>

            <div
              v-if="item.status === 'pending'"
              class="flex shrink-0 gap-2"
            >
              <button
                type="button"
                class="rounded-lg bg-emerald-600 px-3 py-1.5 text-xs font-medium text-white disabled:opacity-50"
                :disabled="busyId === item.id"
                @click="setStatus(item, 'approved')"
              >
                通过
              </button>
              <button
                type="button"
                class="rounded-lg bg-rose-600 px-3 py-1.5 text-xs font-medium text-white disabled:opacity-50"
                :disabled="busyId === item.id"
                @click="setStatus(item, 'rejected')"
              >
                拒绝
              </button>
            </div>
            <div
              v-else
              class="flex shrink-0 gap-2"
            >
              <button
                type="button"
                class="rounded-lg bg-zinc-200 px-3 py-1.5 text-xs font-medium text-zinc-700 dark:bg-white/10 dark:text-zinc-200"
                :disabled="busyId === item.id"
                @click="setStatus(item, 'pending')"
              >
                标为待审
              </button>
            </div>
          </div>
        </li>
      </ul>
    </template>
  </AppContainer>
</template>
