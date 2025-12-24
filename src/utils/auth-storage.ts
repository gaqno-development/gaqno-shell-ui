

const AUTH_STORAGE_KEY = 'gaqno_auth_state'

export interface IAuthState {
  user: {
    id: string
    email?: string
    name?: string
  } | null
  session: {
    access_token?: string
    expires_at?: number
  } | null
  timestamp: number
}

export const authStorage = {
  get(): IAuthState | null {
    if (typeof window === 'undefined') return null

    try {
      const stored = localStorage.getItem(AUTH_STORAGE_KEY)
      if (!stored) return null

      const state: IAuthState = JSON.parse(stored)
      
      // Check if expired (24 hours)
      const now = Date.now()
      const maxAge = 24 * 60 * 60 * 1000 // 24 hours
      if (now - state.timestamp > maxAge) {
        this.clear()
        return null
      }

      return state
    } catch (error) {
      console.error('Error reading auth storage:', error)
      return null
    }
  },

  set(user: IAuthState['user'], session: IAuthState['session']): void {
    if (typeof window === 'undefined') return

    try {
      const state: IAuthState = {
        user,
        session,
        timestamp: Date.now(),
      }
      localStorage.setItem(AUTH_STORAGE_KEY, JSON.stringify(state))
    } catch (error) {
      console.error('Error writing auth storage:', error)
    }
  },

  clear(): void {
    if (typeof window === 'undefined') return

    try {
      localStorage.removeItem(AUTH_STORAGE_KEY)
    } catch (error) {
      console.error('Error clearing auth storage:', error)
    }
  },

  hasValidAuth(): boolean {
    const state = this.get()
    return state !== null && state.user !== null
  },
}

