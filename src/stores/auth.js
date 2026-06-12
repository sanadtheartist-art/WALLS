import { defineStore } from 'pinia'
import { auth, db } from '../config/firebase'
import {
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  signOut,
  onAuthStateChanged,
  updateProfile,
  GoogleAuthProvider,
  signInWithPopup,
  updatePassword
} from 'firebase/auth'
import {
  doc, setDoc, getDoc, serverTimestamp, collection,
  addDoc, query, orderBy, onSnapshot, deleteDoc, updateDoc, writeBatch
} from 'firebase/firestore'
import { supabase } from '../config/supabase'

// ── helpers ──────────────────────────────────────────────────────────────────
const syncUserToSupabase = async (uid, data) => {
  try {
    await supabase.from('users').upsert({
      uid,
      username:           data.username,
      display_name:       data.displayName,
      bio:                data.bio ?? '',
      avatar_url:         data.avatarUrl ?? '',
      background_url:     data.backgroundUrl ?? '',
      theme:              data.theme ?? 'midnight',
      color_palette:      data.colorPalette ?? 'orange',
      custom_accent_color: data.customAccentColor ?? null,
      plan:               data.plan ?? 'free',
      is_public:          data.isPublic ?? true,
      font:               data.font ?? 'inter',
      animation_style:    data.animationStyle ?? 'fade-up',
      default_block_style: data.defaultBlockStyle ?? 'default',
      bg_type:            data.bgType ?? 'default',
      bg_solid:           data.bgSolid ?? null,
      bg_grad_from:       data.bgGradFrom ?? null,
      bg_grad_to:         data.bgGradTo ?? null,
      bg_grad_dir:        data.bgGradDir ?? null,
      bg_blur:            data.bgBlur ?? 0,
      image_url:          data.imageUrl ?? null,
      video_url:          data.videoUrl ?? null,
      seo_title:          data.seoTitle ?? null,
      seo_desc:           data.seoDesc ?? null,
      loading_text:       data.loadingText ?? null,
      loading_bg_color:   data.loadingBgColor ?? null,
      loading_text_color: data.loadingTextColor ?? null,
      loading_text_size:  data.loadingTextSize ?? null,
      loading_animation:  data.loadingAnimation ?? null,
      updated_at:         new Date().toISOString()
    }, { onConflict: 'uid' })
  } catch (e) {
    console.warn('[Supabase sync] failed:', e.message)
  }
}

// ── store ─────────────────────────────────────────────────────────────────────
export const useAuthStore = defineStore('auth', {
  state: () => ({
    user: null,
    loading: true,
    adminUser: null,
    adminLoading: true,
    blocks: [],
    blocksLoading: false,
    unsubscribeBlocks: null
  }),

  actions: {
    // ── Firebase Auth ─────────────────────────────────────────────────────────
    async initializeAuth() {
      return new Promise((resolve) => {
        onAuthStateChanged(auth, async (firebaseUser) => {
          if (firebaseUser) {
            try {
              const userDoc = await getDoc(doc(db, 'users', firebaseUser.uid))
              this.user = {
                uid: firebaseUser.uid,
                email: firebaseUser.email,
                ...userDoc.data()
              }
            } catch (error) {
              console.error('[Auth] Error fetching user doc:', error)
            }
          } else {
            this.user = null
          }
          this.loading = false
          resolve()
        })
      })
    },

    async signUp(email, password, username, displayName) {
      const cleanUsername = username.toLowerCase().trim()
      // Check reserved usernames in Supabase
      try {
        const { data } = await supabase.from('reserved_usernames').select('username').eq('username', cleanUsername).single()
        if (data) throw new Error('Username is reserved')
      } catch (e) {
        if (e.message === 'Username is reserved') throw e
      }

      // Check Firebase username index
      const usernameDoc = await getDoc(doc(db, 'usernames', cleanUsername))
      if (usernameDoc.exists()) throw new Error('Username already taken')

      const { user } = await createUserWithEmailAndPassword(auth, email, password)
      await updateProfile(user, { displayName })

      const userData = {
        uid: user.uid,
        username: cleanUsername,
        displayName,
        bio: '',
        avatarUrl: '',
        backgroundUrl: '',
        theme: 'midnight',
        colorPalette: 'orange',
        font: 'inter',
        animationStyle: 'fade-up',
        ambientEffect: 'none',
        glowColor: '#7c3aed',
        avatarGlow: true,
        isPublic: true,
        customDomain: null,
        plan: 'free',
        createdAt: serverTimestamp(),
        updatedAt: serverTimestamp()
      }

      await setDoc(doc(db, 'users', user.uid), userData)
      await setDoc(doc(db, 'usernames', cleanUsername), { uid: user.uid })
      await syncUserToSupabase(user.uid, { ...userData, created_at: new Date().toISOString() })

      this.user = { uid: user.uid, email: user.email, ...userData }
    },

    async logIn(email, password) {
      const { user } = await signInWithEmailAndPassword(auth, email, password)
      const userDoc = await getDoc(doc(db, 'users', user.uid))
      this.user = { uid: user.uid, email: user.email, ...userDoc.data() }
    },

    async logOut() {
      await signOut(auth)
      this.user = null
    },

    async logInWithGoogle() {
      const provider = new GoogleAuthProvider()
      const { user } = await signInWithPopup(auth, provider)
      
      const userDocRef = doc(db, 'users', user.uid)
      const userDoc = await getDoc(userDocRef)
      
      if (userDoc.exists() && userDoc.data().username) {
        // Existing user with a username
        this.user = { uid: user.uid, email: user.email, ...userDoc.data() }
        return { isNewUser: false }
      } else {
        // Generate automatic username from email
        let baseUsername = user.email.split('@')[0].replace(/[^a-z0-9]/gi, '').toLowerCase()
        if (!baseUsername) baseUsername = 'user'
        let finalUsername = baseUsername
        let attempt = 0
        
        while (true) {
          const check = await getDoc(doc(db, 'usernames', finalUsername))
          if (!check.exists()) {
             const { data } = await supabase.from('reserved_usernames').select('username').eq('username', finalUsername).single()
             if (!data) break // Unique!
          }
          attempt++
          finalUsername = `${baseUsername}${attempt}`
        }

        const userData = {
          uid: user.uid,
          username: finalUsername,
          displayName: user.displayName || 'New User',
          bio: '',
          avatarUrl: user.photoURL || '',
          backgroundUrl: '',
          theme: 'midnight',
          colorPalette: 'orange',
          font: 'inter',
          animationStyle: 'fade-up',
          ambientEffect: 'none',
          glowColor: '#7c3aed',
          avatarGlow: true,
          isPublic: true,
          customDomain: null,
          plan: 'free',
          createdAt: serverTimestamp(),
          updatedAt: serverTimestamp()
        }

        // Handle case where userDoc already exists but has no username
        await setDoc(userDocRef, userData, { merge: true })
        await setDoc(doc(db, 'usernames', finalUsername), { uid: user.uid })
        await syncUserToSupabase(user.uid, { ...userData, created_at: new Date().toISOString() })

        this.user = { uid: user.uid, email: user.email, ...userData }
        return { isNewUser: true }
      }
    },

    // ── Supabase Admin Auth ───────────────────────────────────────────────────
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

    // ── Profile / Design / Settings (Firebase + Supabase sync) ───────────────
    async updateUsername(newUsername) {
      if (!this.user?.uid) return
      const cleanUsername = newUsername.toLowerCase().trim()
      if (cleanUsername === this.user.username) return

      // Validate
      const { data } = await supabase.from('reserved_usernames').select('username').eq('username', cleanUsername).single()
      if (data) throw new Error('Username is reserved')

      const usernameDoc = await getDoc(doc(db, 'usernames', cleanUsername))
      if (usernameDoc.exists()) throw new Error('Username already taken')

      // Delete old, create new
      if (this.user.username) {
        await deleteDoc(doc(db, 'usernames', this.user.username))
      }
      await setDoc(doc(db, 'usernames', cleanUsername), { uid: this.user.uid })
      
      // Update user doc
      await setDoc(doc(db, 'users', this.user.uid), { username: cleanUsername, updatedAt: serverTimestamp() }, { merge: true })
      
      this.user.username = cleanUsername
      await syncUserToSupabase(this.user.uid, this.user)
    },

    async updateProfile(profileData) {
      if (!this.user?.uid) return
      await setDoc(doc(db, 'users', this.user.uid), { ...profileData, updatedAt: serverTimestamp() }, { merge: true })
      this.user = { ...this.user, ...profileData }
      await syncUserToSupabase(this.user.uid, this.user)
    },

    async updateDesign(designData) {
      if (!this.user?.uid) return
      await setDoc(doc(db, 'users', this.user.uid), { ...designData, updatedAt: serverTimestamp() }, { merge: true })
      this.user = { ...this.user, ...designData }
      await syncUserToSupabase(this.user.uid, this.user)
    },

    async updateSettings(settingsData) {
      if (!this.user?.uid) return
      await setDoc(doc(db, 'users', this.user.uid), { ...settingsData, updatedAt: serverTimestamp() }, { merge: true })
      this.user = { ...this.user, ...settingsData }
      await syncUserToSupabase(this.user.uid, this.user)
    },

    // ── Block Subscription ────────────────────────────────────────────────────
    async subscribeToBlocks() {
      if (!this.user?.uid) return
      this.blocksLoading = true
      const q = query(collection(db, 'users', this.user.uid, 'blocks'), orderBy('position'))
      this.unsubscribeBlocks = onSnapshot(q, (snapshot) => {
        this.blocks = snapshot.docs.map(d => ({ id: d.id, ...d.data() }))
        this.blocksLoading = false
      }, () => { this.blocksLoading = false })
    },

    unsubscribeFromBlocks() {
      if (this.unsubscribeBlocks) {
        this.unsubscribeBlocks()
        this.unsubscribeBlocks = null
      }
    },

    // ── Block CRUD ────────────────────────────────────────────────────────────
    async addBlock(type) {
      if (!this.user?.uid) return
      const position = this.blocks.length

      const defaults = {
        link:    { label: 'New Link', url: 'https://' },
        social:  { platform: 'twitter', url: 'https://twitter.com/' },
        hero:    { title: 'Welcome to my Wall', subtitle: 'Discover what I do.', ctaLabel: 'Explore', ctaUrl: '', imageUrl: '' },
        about:   { name: this.user.displayName || 'Your Name', bio: 'Tell the world about yourself...', avatarUrl: this.user.avatarUrl || '' },
        contact: { title: 'Get In Touch' },
        text:    { content: 'Write something amazing...' },
        divider: { style: 'line' },
        gallery: { images: [], columns: 2 },
        video:   { url: '', caption: '' },
      }

      await addDoc(collection(db, 'users', this.user.uid, 'blocks'), {
        type,
        position,
        visible: true,
        style: 'default',
        data: defaults[type] ?? {},
        createdAt: serverTimestamp(),
        updatedAt: serverTimestamp()
      })
    },

    async addLinkBlock(label, url) {
      if (!this.user?.uid) return
      await addDoc(collection(db, 'users', this.user.uid, 'blocks'), {
        type: 'link', position: this.blocks.length, visible: true, style: 'default',
        data: { label, url },
        createdAt: serverTimestamp(), updatedAt: serverTimestamp()
      })
    },

    async updateBlock(id, update) {
      if (!this.user?.uid) return
      const updateData = { updatedAt: serverTimestamp() }
      if (update.data !== undefined) {
        updateData.data = update.data
      }
      if (update.style !== undefined) {
        updateData.style = update.style
      }
      await updateDoc(doc(db, 'users', this.user.uid, 'blocks', id), updateData)
    },

    async deleteBlock(id) {
      if (!this.user?.uid) return
      await deleteDoc(doc(db, 'users', this.user.uid, 'blocks', id))
      // Re-position remaining blocks
      const remaining = this.blocks.filter(b => b.id !== id)
      const batch = writeBatch(db)
      remaining.forEach((b, i) => {
        batch.update(doc(db, 'users', this.user.uid, 'blocks', b.id), { position: i })
      })
      await batch.commit()
    },

    async reorderBlocks(newOrder) {
      if (!this.user?.uid) return
      const batch = writeBatch(db)
      newOrder.forEach((block, i) => {
        batch.update(doc(db, 'users', this.user.uid, 'blocks', block.id), { position: i })
      })
      await batch.commit()
    },

    async toggleBlockVisibility(id, visible) {
      if (!this.user?.uid) return
      await updateDoc(doc(db, 'users', this.user.uid, 'blocks', id), { visible, updatedAt: serverTimestamp() })
    },

    async setPassword(newPassword) {
      if (!auth.currentUser) throw new Error('No user is logged in')
      await updatePassword(auth.currentUser, newPassword)
    }
  }
})
