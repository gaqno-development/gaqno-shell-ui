import { useAuth } from '@gaqno-dev/core/hooks/useAuth'

export const useDashboard = () => {
  const { profile, loading } = useAuth()

  return {
    profile,
    loading,
  }
}

