import { useAuth } from '@gaqno-dev/frontcore/hooks/useAuth'

export const useDashboard = () => {
  const { profile, loading } = useAuth()

  return {
    profile,
    loading,
  }
}

