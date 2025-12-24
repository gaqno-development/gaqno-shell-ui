import { useQuery } from '@tanstack/react-query'
import { useAuth } from '@gaqno-dev/frontcore/hooks/useAuth'

interface UserProfile {
  name?: string
  email?: string
  role?: string
  department?: string
  avatar_url?: string
}

export const useSettings = () => {
  const { profile } = useAuth()

  const { data: profileData, isLoading } = useQuery<UserProfile>({
    queryKey: ['user', 'profile'],
    queryFn: async () => {
      // Use profile from auth context, or fetch if needed
      return profile || {}
    },
    enabled: !!profile,
    initialData: profile,
  })

  return {
    profile: profileData,
    loading: isLoading,
  }
}

