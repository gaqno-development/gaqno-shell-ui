import { useAuth } from '@gaqno-dev/frontcore/hooks/useAuth'

export const useSettings = () => {
  const { profile, loading } = useAuth()

  return {
    profile,
    loading,
  }
}

