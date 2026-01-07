import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { ssoClient } from '@gaqno-development/frontcore/utils/api'
import type {
  WidgetsData,
  DashboardSummary,
  DashboardPreferences,
} from '../types/dashboard.types'

export const useDashboardWidgets = () => {
  return useQuery<WidgetsData>({
    queryKey: ['dashboard', 'widgets'],
    queryFn: async () => {
      const { data } = await ssoClient.get<WidgetsData>('/dashboard/widgets')
      return data
    },
    staleTime: 5 * 60 * 1000, // 5 minutes
  })
}

export const useDashboardData = () => {
  return useQuery<DashboardSummary>({
    queryKey: ['dashboard', 'summary'],
    queryFn: async () => {
      const { data } = await ssoClient.get<DashboardSummary>('/dashboard/summary')
      return data
    },
    staleTime: 1 * 60 * 1000, // 1 minute
    refetchInterval: 5 * 60 * 1000, // Refetch every 5 minutes
  })
}

export const useDashboardPreferences = () => {
  return useQuery<DashboardPreferences>({
    queryKey: ['dashboard', 'preferences'],
    queryFn: async () => {
      const { data } = await ssoClient.get<DashboardPreferences>('/dashboard/preferences')
      return data || { widgets: [], layout: {} }
    },
    staleTime: 5 * 60 * 1000, // 5 minutes
  })
}

export const useSaveDashboardPreferences = () => {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: async (preferences: DashboardPreferences) => {
      const { data } = await ssoClient.put<DashboardPreferences>(
        '/dashboard/preferences',
        preferences
      )
      return data
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['dashboard', 'preferences'] })
    },
  })
}

