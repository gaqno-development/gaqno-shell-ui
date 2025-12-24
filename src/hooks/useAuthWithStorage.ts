

import { useAuth as useCoreAuth } from '@gaqno-dev/frontcore/hooks/useAuth'
import { authStorage } from '@/utils/auth-storage'

/**
 * Wrapper around useAuth that also manages localStorage
 */
export const useAuth = () => {
  const auth = useCoreAuth()

  const signOut = async () => {
    // Clear localStorage first
    authStorage.clear()
    // Then call the core signOut
    await auth.signOut()
  }

  return {
    ...auth,
    signOut,
  }
}

