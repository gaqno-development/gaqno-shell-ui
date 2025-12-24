import { useState } from 'react'

export const useUserDashboard = () => {
  const [loading] = useState(false)

  // TODO: Implement actual data fetching when backend is ready
  // For now, return mock data structure
  return {
    loading,
    data: {
      completedTasks: 0,
      pendingTasks: 0,
      documents: 0,
      performance: '--',
    },
  }
}

