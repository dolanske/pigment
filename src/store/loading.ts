/**
 * For global state we use pinia. It allows us to access a singele point of truth for data
 * anywhere else in the app
 *
 * I recommend checking out https://pinia.vuejs.org/core-concepts/
 */

import { defineStore } from 'pinia'

interface State {
  loading: Set<string>
  progress: number | null
}

export const useLoading = defineStore('loading', {
  state: () => ({
    // We use set instead of an array as it stores only unique values.
    loading: new Set(),
    progress: null,
  } as State),
  actions: {
    // Add item(s) to loading
    add(...items: Array<string>) {
      if (items.length > 0) {
        for (const item of items)
          this.loading.add(item)
      }
    },
    // Remove item(s) from loading
    del(...items: Array<string>) {
      if (items.length > 0) {
        for (const item of items)
          this.loading.delete(item)
      }
    },
    // Sets the progress percentage
    setProgress(amount: number) {
      this.progress = Math.min(100, amount)
    },
    // Completes the progress. Sets progress to 100 and after a slight
    // delay resets it to null
    clearProgress() {
      this.progress = 100
      setTimeout(() => {
        this.progress = null
      }, 300)
    },
  },
  getters: {
    // Check wether an item is currently loading
    get:
      state =>
        (...items: Array<string>) => {
          if (items.length > 0)
            return Array.from(state.loading).some((item: any) => items.includes(item))
          return state.loading.size > 0
        },
  },
})
