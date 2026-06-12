import { defineStore } from 'pinia'
import { supabase } from '../config/supabase'

export const useAuthStore = defineStore('auth', {
  state: () => ({
    user: null,
    loading: true,
    adminUser: null,
    adminLoading: true,
    blocks: [],
    blocksLoading: false,
    unsubscribeBlocks: null,
    unsubscribeAuth: null
  }),

  actions: {
    async initializeAuth() {
      return new Promise((resolve) => {
        this.unsubscribeAuth = supabase.auth.onAuthStateChange(async (event, session) => {
          if (session?.user) {
            await this.fetchProfile(session.user.id)
          } else {
            this.user = null
          }
          this.loading = false
          resolve()
        })
      })
    },

    async fetchProfile(userId) {
      let { data, error } = await supabase.from('profiles').select('*').eq('id', userId).single()
      
      // If no profile exists, create one (for Google signups)
      if (error && error.code === 'PGRST116') {
        const { data: userData } = await supabase.auth.getUser()
        const email = userData.user?.email
        const displayName = userData.user?.user_metadata?.full_name || 'New User'
        const avatarUrl = userData.user?.user_metadata?.avatar_url || ''
        
        // Generate unique username
        let baseUsername = email?.split('@')[0].replace(/[^a-z0-9]/gi, '').toLowerCase() || 'user'
        let finalUsername = baseUsername
        let attempt = 0
        
        while (true) {
          const { data: existing } = await supabase.from('usernames').select('username').eq('username', finalUsername).single()
          const { data: reserved } = await supabase.from('reserved_usernames').select('username').eq('username', finalUsername).single()
          if (!existing && !reserved) break
          attempt++
          finalUsername = `${baseUsername}${attempt}`
        }

        // Insert profile and username
        await supabase.from('profiles').insert({
          id: userId,
          username: finalUsername,
          display_name: displayName,
          bio: '',
          avatar_url: avatarUrl,
          background_url: '',
          theme: 'midnight',
          color_palette: 'violet',
          font: 'inter',
          animation_style: 'fade-up',
          ambient_effect: 'none',
          plan: 'free',
          is_public: true
        })
        await supabase.from('usernames').insert({
          username: finalUsername,
          user_id: userId
        })
        
        // Fetch the newly created profile
        const { data: newProfile } = await supabase.from('profiles').select('*').eq('id', userId).single()
        data = newProfile
      }

      if (data) {
        this.user = {
          id: data.id,
          uid: data.id,
          ...data
        }
      }
    },

    async signUp(email, password, username, displayName) {
      const cleanUsername = username.toLowerCase().trim()

      const { data: reserved } = await supabase.from('reserved_usernames').select('username').eq('username', cleanUsername).single()
      if (reserved) throw new Error('Username is reserved')

      const { data: existing } = await supabase.from('usernames').select('username').eq('username', cleanUsername).single()
      if (existing) throw new Error('Username already taken')

      const { data: authData, error: authError } = await supabase.auth.signUp({ email, password })
      if (authError) throw authError

      const userId = authData.user.id

      const { error: profileError } = await supabase.from('profiles').insert({
        id: userId,
        username: cleanUsername,
        display_name: displayName,
        bio: '',
        avatar_url: '',
        background_url: '',
        theme: 'midnight',
        color_palette: 'violet',
        font: 'inter',
        animation_style: 'fade-up',
        ambient_effect: 'none',
        plan: 'free',
        is_public: true
      })
      if (profileError) throw profileError

      const { error: usernameError } = await supabase.from('usernames').insert({
        username: cleanUsername,
        user_id: userId
      })
      if (usernameError) throw usernameError

      await this.fetchProfile(userId)
    },

    async logIn(email, password) {
      const { data, error } = await supabase.auth.signInWithPassword({ email, password })
      if (error) throw error
      await this.fetchProfile(data.user.id)
    },

    async logOut() {
      await supabase.auth.signOut()
      this.user = null
      this.blocks = []
      if (this.unsubscribeBlocks) {
        this.unsubscribeBlocks()
        this.unsubscribeBlocks = null
      }
    },

    async logInWithGoogle() {
      const { data, error } = await supabase.auth.signInWithOAuth({ provider: 'google', options: { redirectTo: window.location.origin } })
      if (error) throw error
      // We'll handle the rest after redirect in initializeAuth
    },

    async adminLogIn(email, password) {
      const { data, error } = await supabase.auth.signInWithPassword({ email, password })
      if (error) throw error
      this.adminUser = data.user
      this.adminLoading = false
    },

    async adminLogOut() {
      await supabase.auth.signOut()
      this.adminUser = null
    },

    async updateUsername(newUsername) {
      if (!this.user?.id) return
      const cleanUsername = newUsername.toLowerCase().trim()
      if (cleanUsername === this.user.username) return

      const { data: reserved } = await supabase.from('reserved_usernames').select('username').eq('username', cleanUsername).single()
      if (reserved) throw new Error('Username is reserved')

      const { data: existing } = await supabase.from('usernames').select('username').eq('username', cleanUsername).single()
      if (existing) throw new Error('Username already taken')

      const { error: deleteOld } = await supabase.from('usernames').delete().eq('username', this.user.username)
      if (deleteOld) throw deleteOld

      const { error: insertNew } = await supabase.from('usernames').insert({
        username: cleanUsername,
        user_id: this.user.id
      })
      if (insertNew) throw insertNew

      const { error: updateProfile } = await supabase.from('profiles').update({ username: cleanUsername }).eq('id', this.user.id)
      if (updateProfile) throw updateProfile

      this.user.username = cleanUsername
    },

    async updateProfile(profileData) {
      if (!this.user?.id) return
      const mappedData = {}
      for (const [key, value] of Object.entries(profileData)) {
        const snakeKey = key.replace(/([a-z])([A-Z])/g, '$1_$2').toLowerCase()
        mappedData[snakeKey] = value
      }
      const { error } = await supabase.from('profiles').update(mappedData).eq('id', this.user.id)
      if (!error) this.user = { ...this.user, ...profileData }
    },

    async updateDesign(designData) {
      if (!this.user?.id) return
      const mappedData = {}
      for (const [key, value] of Object.entries(designData)) {
        const snakeKey = key.replace(/([a-z])([A-Z])/g, '$1_$2').toLowerCase()
        mappedData[snakeKey] = value
      }
      const { error } = await supabase.from('profiles').update(mappedData).eq('id', this.user.id)
      if (!error) this.user = { ...this.user, ...designData }
    },

    async updateSettings(settingsData) {
      if (!this.user?.id) return
      const mappedData = {}
      for (const [key, value] of Object.entries(settingsData)) {
        const snakeKey = key.replace(/([a-z])([A-Z])/g, '$1_$2').toLowerCase()
        mappedData[snakeKey] = value
      }
      const { error } = await supabase.from('profiles').update(mappedData).eq('id', this.user.id)
      if (!error) this.user = { ...this.user, ...settingsData }
    },

    async subscribeToBlocks() {
      if (!this.user?.id) return
      this.blocksLoading = true

      this.unsubscribeBlocks = supabase
        .channel('public:blocks')
        .on('postgres_changes', {
          event: '*',
          schema: 'public',
          table: 'blocks',
          filter: `user_id=eq.${this.user.id}`
        }, () => this.fetchBlocks())
        .subscribe()

      await this.fetchBlocks()
    },

    async fetchBlocks() {
      if (!this.user?.id) return
      const { data, error } = await supabase.from('blocks').select('*').eq('user_id', this.user.id).order('position')
      if (!error) {
        this.blocks = data.map(b => ({
          id: b.id,
          ...b,
          // Map snake_case to camelCase for compatibility
          user_id: b.user_id,
          created_at: b.created_at,
          updated_at: b.updated_at
        }))
      }
      this.blocksLoading = false
    },

    unsubscribeFromBlocks() {
      if (this.unsubscribeBlocks) {
        this.unsubscribeBlocks.unsubscribe()
        this.unsubscribeBlocks = null
      }
    },

    async addBlock(type) {
      if (!this.user?.id) return
      const position = this.blocks.length

      const defaults = {
        link:    { label: 'New Link', url: 'https://' },
        social:  { platform: 'twitter', url: 'https://twitter.com/' },
        hero:    { title: 'Welcome to my Wall', subtitle: 'Discover what I do.', ctaLabel: 'Explore', ctaUrl: '', imageUrl: '' },
        about:   { name: this.user.display_name || this.user.displayName || 'Your Name', bio: 'Tell the world about yourself...', avatarUrl: this.user.avatar_url || this.user.avatarUrl || '' },
        contact: { title: 'Get In Touch' },
        text:    { content: 'Write something amazing...' },
        divider: { style: 'line' },
        gallery: { images: [], columns: 2, layout: 'grid' },
        video:   { url: '', caption: '' },
      }

      const { error } = await supabase.from('blocks').insert({
        user_id: this.user.id,
        type,
        position,
        visible: true,
        style: 'default',
        data: defaults[type] ?? {}
      })
      if (error) throw error
    },

    async addLinkBlock(label, url) {
      if (!this.user?.id) return
      const position = this.blocks.length
      const { error } = await supabase.from('blocks').insert({
        user_id: this.user.id,
        type: 'link',
        position,
        visible: true,
        style: 'default',
        data: { label, url }
      })
      if (error) throw error
    },

    async updateBlock(id, update) {
      if (!this.user?.id) return
      const updateData = {}
      if (update.data !== undefined) updateData.data = update.data
      if (update.style !== undefined) updateData.style = update.style
      const { error } = await supabase.from('blocks').update(updateData).eq('id', id).eq('user_id', this.user.id)
      if (error) throw error
    },

    async deleteBlock(id) {
      if (!this.user?.id) return
      const { error } = await supabase.from('blocks').delete().eq('id', id).eq('user_id', this.user.id)
      if (error) throw error
      const remaining = this.blocks.filter(b => b.id !== id)
      for (let i = 0; i < remaining.length; i++) {
        await supabase.from('blocks').update({ position: i }).eq('id', remaining[i].id)
      }
    },

    async reorderBlocks(newOrder) {
      if (!this.user?.id) return
      for (let i = 0; i < newOrder.length; i++) {
        await supabase.from('blocks').update({ position: i }).eq('id', newOrder[i].id).eq('user_id', this.user.id)
      }
    },

    async toggleBlockVisibility(id, visible) {
      if (!this.user?.id) return
      const { error } = await supabase.from('blocks').update({ visible }).eq('id', id).eq('user_id', this.user.id)
      if (error) throw error
    },

    async setPassword(newPassword) {
      const { error } = await supabase.auth.updateUser({ password: newPassword })
      if (error) throw error
    }
  }
})
