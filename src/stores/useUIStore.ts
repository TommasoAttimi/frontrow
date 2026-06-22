import { create } from 'zustand'

export type ToastVariant = 'success' | 'error' | 'info' | 'neutral' | 'loading'

export interface ToastItem {
  id: string
  variant: ToastVariant
  message: string
}

interface UIState {
  toasts: ToastItem[]
  addToast: (toast: Omit<ToastItem, 'id'>) => string
  dismissToast: (id: string) => void
}

export const useUIStore = create<UIState>((set) => ({
  toasts: [],
  addToast: (toast) => {
    const id = crypto.randomUUID()
    set((state) => ({ toasts: [...state.toasts, { ...toast, id }] }))
    if (toast.variant !== 'loading') {
      setTimeout(() => {
        set((state) => ({ toasts: state.toasts.filter((t) => t.id !== id) }))
      }, 3000)
    }
    return id
  },
  dismissToast: (id) =>
    set((state) => ({ toasts: state.toasts.filter((t) => t.id !== id) })),
}))

/** Imperative helper so non-component code can fire toasts. */
export const toast = {
  success: (message: string) =>
    useUIStore.getState().addToast({ variant: 'success', message }),
  error: (message: string) =>
    useUIStore.getState().addToast({ variant: 'error', message }),
  info: (message: string) =>
    useUIStore.getState().addToast({ variant: 'info', message }),
}
