<script setup lang="ts">
import { SITE_NAME, SITE_NAME_EN } from '~/utils/site'

definePageMeta({
  layout: false,
})

usePageSeo({
  title: '申请收录',
  description: `向 ${SITE_NAME} 提交优质网站，审核通过后将整理进对应分类。`,
  path: '/apply',
})

const toast = useToast()
const navBgStyle = computed(() => ({
  backgroundImage: `url('${assetUrl('/images/nav-bg.jpg')}')`,
}))
const { data: meta } = await useFetch('/api/submissions/meta')

const form = reactive({
  url: '',
  category: '',
  name: '',
  iconUrl: '',
  captcha: '',
  website: '',
})

const submitting = ref(false)
const prefetching = ref(false)
const captchaKey = ref(0)
const iconFileInput = ref<HTMLInputElement | null>(null)
const iconFileName = ref('')

const ICON_MAX_BYTES = 1024 * 1024
const ICON_ACCEPT = 'image/png,image/jpeg,image/gif,image/webp,image/svg+xml,image/x-icon,image/vnd.microsoft.icon,.ico'

const guidelines = [
  '禁止提交违规违法站点',
  '页面整洁，无多个弹窗广告和恶意跳转',
  '非盈利性网站，网站正常访问',
  '添加本站友链或网站已 ICP 备案优先收录',
]

function refreshCaptcha() {
  captchaKey.value += 1
  form.captcha = ''
}

function validateForm(): string | null {
  if (!form.url.trim()) {
    return '请填写网站链接'
  }
  if (!form.category) {
    return '请选择分组'
  }
  if (!form.name.trim()) {
    return '请填写网站名称'
  }
  if (!form.captcha.trim()) {
    return '请填写验证码'
  }
  return null
}

async function onPrefetch() {
  if (!form.url.trim()) {
    toast.error('请先填写网站链接')
    return
  }

  prefetching.value = true
  try {
    const result = await $fetch<{ name: string; iconUrl: string; url: string }>(
      '/api/submissions/prefetch',
      {
        method: 'POST',
        body: { url: form.url },
      },
    )
    form.url = result.url || form.url
    if (result.name) {
      form.name = result.name
    }
    if (result.iconUrl) {
      form.iconUrl = result.iconUrl
      iconFileName.value = ''
    }
    toast.success('已自动获取网站信息')
  }
  catch (error: unknown) {
    const err = error as { data?: { message?: string }; message?: string }
    toast.error(err?.data?.message || err?.message || '自动获取失败，请手动填写')
  }
  finally {
    prefetching.value = false
  }
}

function onIconTextInput(event: Event) {
  iconFileName.value = ''
  form.iconUrl = (event.target as HTMLInputElement).value
}

function onPickIcon() {
  iconFileInput.value?.click()
}

function readFileAsDataUrl(file: File): Promise<string> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader()
    reader.onload = () => resolve(String(reader.result || ''))
    reader.onerror = () => reject(new Error('读取文件失败'))
    reader.readAsDataURL(file)
  })
}

async function onIconFileChange(event: Event) {
  const input = event.target as HTMLInputElement
  const file = input.files?.[0]
  input.value = ''

  if (!file) {
    return
  }

  if (!file.type.startsWith('image/') && !/\.ico$/i.test(file.name)) {
    toast.error('请选择图片文件（png / jpg / webp / ico 等）')
    return
  }

  if (file.size > ICON_MAX_BYTES) {
    toast.error('图标不能超过 1MB，请压缩后重试')
    return
  }

  try {
    const dataUrl = await readFileAsDataUrl(file)
    form.iconUrl = dataUrl
    iconFileName.value = file.name
    toast.success('已选择本地图标')
  }
  catch {
    toast.error('读取图标失败，请重试')
  }
}

async function onSubmit() {
  const validationError = validateForm()
  if (validationError) {
    toast.error(validationError)
    return
  }

  submitting.value = true
  try {
    const result = await $fetch<{ ok: boolean; message: string }>('/api/submissions', {
      method: 'POST',
      body: { ...form },
    })
    toast.success(result.message)
    form.url = ''
    form.category = ''
    form.name = ''
    form.iconUrl = ''
    iconFileName.value = ''
    form.captcha = ''
    form.website = ''
    refreshCaptcha()
  }
  catch (error: unknown) {
    const err = error as { data?: { message?: string }; message?: string }
    toast.error(err?.data?.message || err?.message || '提交失败，请稍后重试')
    refreshCaptcha()
  }
  finally {
    submitting.value = false
  }
}
</script>

<template>
  <div class="relative min-h-screen overflow-hidden px-4 py-10 sm:px-6 sm:py-14">
    <div
      class="pointer-events-none fixed inset-0 -z-10 bg-cover bg-center bg-no-repeat"
      :style="navBgStyle"
      aria-hidden="true"
    />
    <div
      class="pointer-events-none fixed inset-0 -z-10 bg-sky-900/25 backdrop-blur-[2px]"
      aria-hidden="true"
    />

    <div class="mx-auto w-full max-w-2xl">
      <div class="rounded-2xl bg-white/95 px-6 py-8 shadow-[0_20px_50px_rgba(15,23,42,0.18)] backdrop-blur-sm sm:px-10 sm:py-10">
        <h1 class="text-center text-2xl font-bold tracking-tight text-zinc-900 sm:text-3xl">
          申请收录
        </h1>

        <section class="mt-6">
          <h2 class="text-sm font-semibold text-zinc-900">
            收录说明：
          </h2>
          <ol class="mt-2 list-decimal space-y-1.5 pl-5 text-sm leading-6 text-zinc-600">
            <li
              v-for="item in guidelines"
              :key="item"
            >
              {{ item }}
            </li>
          </ol>
        </section>

        <form
          class="relative mt-7 space-y-5"
          novalidate
          @submit.prevent="onSubmit"
        >
          <div>
            <label
              for="url"
              class="block text-sm font-semibold text-zinc-800"
            >
              <span class="text-rose-500">*</span>URL链接地址
            </label>
            <div class="mt-2 flex overflow-hidden rounded-lg border border-zinc-200 focus-within:border-sky-400 focus-within:ring-2 focus-within:ring-sky-200">
              <input
                id="url"
                v-model="form.url"
                type="text"
                maxlength="500"
                class="min-w-0 flex-1 border-0 bg-transparent px-3 py-2.5 text-sm outline-none"
                placeholder="完整链接或域名"
              >
              <button
                type="button"
                class="shrink-0 border-l border-zinc-200 bg-zinc-50 px-3 text-sm text-sky-700 transition hover:bg-sky-50 disabled:opacity-60"
                :disabled="prefetching"
                @click="onPrefetch"
              >
                {{ prefetching ? '获取中' : '自动获取' }}
              </button>
            </div>
          </div>

          <div>
            <label
              for="category"
              class="block text-sm font-semibold text-zinc-800"
            >
              <span class="text-rose-500">*</span>选择分组
            </label>
            <select
              id="category"
              v-model="form.category"
              class="apply-select mt-2 w-full rounded-lg border border-zinc-200 bg-white px-3 py-2.5 text-sm outline-none focus:border-sky-400 focus:ring-2 focus:ring-sky-200"
            >
              <option
                disabled
                value=""
              >
                请选择
              </option>
              <option
                v-for="item in meta?.categories ?? []"
                :key="item.slug"
                :value="item.slug"
              >
                {{ item.name }}
              </option>
            </select>
          </div>

          <div>
            <label
              for="name"
              class="block text-sm font-semibold text-zinc-800"
            >
              <span class="text-rose-500">*</span>网站名称
            </label>
            <input
              id="name"
              v-model="form.name"
              type="text"
              maxlength="80"
              class="mt-2 w-full rounded-lg border border-zinc-200 px-3 py-2.5 text-sm outline-none focus:border-sky-400 focus:ring-2 focus:ring-sky-200"
              placeholder="网站名称"
            >
            <p class="mt-1.5 text-xs text-zinc-400">
              填写网站名称
            </p>
          </div>

          <div>
            <label
              for="iconUrl"
              class="block text-sm font-semibold text-zinc-800"
            >
              网站图标
            </label>
            <div class="mt-2 flex overflow-hidden rounded-lg border border-zinc-200 focus-within:border-sky-400 focus-within:ring-2 focus-within:ring-sky-200">
              <input
                id="iconUrl"
                type="text"
                :value="iconFileName || form.iconUrl"
                class="min-w-0 flex-1 border-0 bg-transparent px-3 py-2.5 text-sm outline-none"
                placeholder="填写图标的URL地址，或点击选择上传"
                @input="onIconTextInput"
              >
              <input
                ref="iconFileInput"
                type="file"
                class="hidden"
                :accept="ICON_ACCEPT"
                @change="onIconFileChange"
              >
              <button
                type="button"
                class="shrink-0 border-l border-zinc-200 bg-zinc-50 px-4 text-sm text-sky-700 transition hover:bg-sky-50"
                @click="onPickIcon"
              >
                选择
              </button>
            </div>
            <p class="mt-1.5 text-xs text-zinc-500">
              可填图标 URL，或点击「选择」从本地上传（png / jpg / webp / ico，≤1MB）
            </p>
            <p class="mt-1 text-xs text-zinc-400">
              部分网站无法自动获取，请手动填写或上传
            </p>
            <div
              v-if="form.iconUrl"
              class="mt-2 flex items-center gap-2"
            >
              <img
                :src="form.iconUrl"
                alt=""
                width="24"
                height="24"
                class="h-6 w-6 rounded object-contain"
                @error="($event.target as HTMLImageElement).style.display = 'none'"
              >
              <span class="text-xs text-zinc-400">图标预览</span>
            </div>
          </div>

          <div>
            <label
              for="captcha"
              class="block text-sm font-semibold text-zinc-800"
            >
              <span class="text-rose-500">*</span>验证码
            </label>
            <div class="mt-2 flex items-center gap-3">
              <input
                id="captcha"
                v-model="form.captcha"
                type="text"
                inputmode="numeric"
                maxlength="8"
                class="w-36 rounded-lg border border-zinc-200 px-3 py-2.5 text-sm outline-none focus:border-sky-400 focus:ring-2 focus:ring-sky-200"
                placeholder="验证码"
                autocomplete="off"
              >
              <button
                type="button"
                class="overflow-hidden rounded-lg border border-zinc-200 bg-zinc-50"
                title="点击刷新验证码"
                @click="refreshCaptcha"
              >
                <img
                  :key="captchaKey"
                  :src="`/api/captcha?t=${captchaKey}`"
                  alt="验证码"
                  width="120"
                  height="40"
                  class="h-10 w-[7.5rem]"
                >
              </button>
            </div>
          </div>

          <div
            class="absolute -left-[9999px] h-0 w-0 overflow-hidden"
            aria-hidden="true"
          >
            <label for="website">网站</label>
            <input
              id="website"
              v-model="form.website"
              type="text"
              tabindex="-1"
              autocomplete="off"
            >
          </div>

          <button
            type="submit"
            class="w-full rounded-lg bg-sky-500 py-3 text-sm font-semibold text-white transition hover:bg-sky-600 disabled:cursor-not-allowed disabled:opacity-60"
            :disabled="submitting"
          >
            {{ submitting ? '提交中…' : '提交' }}
          </button>

          <div class="pt-2 text-center">
            <NuxtLink
              to="/"
              class="text-sm text-zinc-400 transition hover:text-zinc-600"
            >
              返回首页
            </NuxtLink>
            <p class="mt-3 text-xs text-zinc-400">
              Copyright © 2026 {{ SITE_NAME }}（{{ SITE_NAME_EN }}）. All Rights Reserved.
            </p>
          </div>
        </form>
      </div>
    </div>
  </div>
</template>

<style scoped>
.apply-select {
  appearance: none;
  padding-right: 2.5rem;
  background-image: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' fill='none' viewBox='0 0 24 24' stroke='%2371717a'%3E%3Cpath stroke-linecap='round' stroke-linejoin='round' stroke-width='2' d='m6 9 6 6 6-6'/%3E%3C/svg%3E");
  background-position: right 0.75rem center;
  background-repeat: no-repeat;
  background-size: 1rem;
}
</style>
