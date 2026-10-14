export type ToastType = 'info' | 'success' | 'error'

export interface ToastItem {
  id: number
  message: string
  type: ToastType
}

const toasts = ref<ToastItem[]>([])
let seed = 0

export function useToast() {
  function dismiss(id: number) {
    toasts.value = toasts.value.filter(item => item.id !== id)
  }

  function show(message: string, type: ToastType = 'info', durationMs = 2800) {
    const id = ++seed
    toasts.value = [...toasts.value, { id, message, type }]
    if (import.meta.client && durationMs > 0) {
      window.setTimeout(() => dismiss(id), durationMs)
    }
    return id
  }

  return {
    toasts,
    show,
    dismiss,
    info: (message: string) => show(message, 'info'),
    success: (message: string) => show(message, 'success'),
    error: (message: string) => show(message, 'error'),
  }
}
