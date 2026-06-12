import { defineStore } from 'pinia'

export const useMainStore = defineStore('main', {
  state: () => ({
    loading: false,
    user: null
  }),
  actions: {
    setLoading(value) {
      this.loading = value
    },
    setUser(user) {
      this.user = user
    }
  }
})
