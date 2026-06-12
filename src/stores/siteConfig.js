import { defineStore } from 'pinia'
import { supabase } from '../config/supabase'
import { DEFAULT_LANDING_PAGE, mergeLandingPage } from '../constants/design'

const DEFAULTS = {
  maintenance_mode: { active: false, message: '' },
  announcement_banner: { active: false, text: '' },
  featured_walls: [],
  landing_page: { ...DEFAULT_LANDING_PAGE }
}

export const useSiteConfigStore = defineStore('siteConfig', {
  state: () => ({
    loaded: false,
    loading: false,
    error: null,
    maintenance_mode: { ...DEFAULTS.maintenance_mode },
    announcement_banner: { ...DEFAULTS.announcement_banner },
    featured_walls: [...DEFAULTS.featured_walls],
    landing_page: { ...DEFAULTS.landing_page },
    featuredUsers: []
  }),

  getters: {
    maintenanceActive: (state) => state.maintenance_mode.active,
    bannerActive: (state) => state.announcement_banner.active,
    bannerText: (state) => state.announcement_banner.text,
    landing: (state) => mergeLandingPage(state.landing_page)
  },

  actions: {
    async fetchConfig() {
      if (this.loading) return
      this.loading = true
      this.error = null

      const { data, error } = await supabase.from('site_settings').select('*')
      if (error) {
        this.error = error.message
        this.loading = false
        return
      }

      data?.forEach((row) => {
        if (row.key in DEFAULTS) {
          if (row.key === 'landing_page') {
            this[row.key] = mergeLandingPage(row.value)
          } else {
            this[row.key] = row.value
          }
        }
      })

      if (this.featured_walls.length) {
        await this.fetchFeaturedUsers()
      }

      this.loaded = true
      this.loading = false
    },

    async fetchFeaturedUsers() {
      if (!this.featured_walls.length) {
        this.featuredUsers = []
        return
      }

      try {
        const { data, error } = await supabase
          .from('users')
          .select('username, display_name, avatar_url')
          .in('username', this.featured_walls)

        if (error) {
          console.error('Error fetching featured users:', error)
          // Fallback to just usernames
          this.featuredUsers = this.featured_walls.map(u => ({ username: u, display_name: u, avatar_url: '' }))
          return
        }

        // Maintain order from featured_walls
        const userMap = new Map()
        data?.forEach(user => userMap.set(user.username, user))
        this.featuredUsers = this.featured_walls.map(username => {
          return userMap.get(username) || { username, display_name: username, avatar_url: '' }
        })
      } catch (e) {
        console.error('Error fetching featured users:', e)
        this.featuredUsers = this.featured_walls.map(u => ({ username: u, display_name: u, avatar_url: '' }))
      }
    },

    async saveConfig(key, value, updatedBy = null) {
      const { error } = await supabase.from('site_settings').upsert(
        {
          key,
          value,
          updated_by: updatedBy,
          updated_at: new Date().toISOString()
        },
        { onConflict: 'key' }
      )

      if (error) throw error

      this[key] = value
      if (key === 'featured_walls') {
        await this.fetchFeaturedUsers()
      }
    }
  }
})
