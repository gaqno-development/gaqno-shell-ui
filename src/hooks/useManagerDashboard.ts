import { useState } from 'react'

export const useManagerDashboard = () => {
  const [loading] = useState(false)

  // TODO: Implement actual data fetching when backend is ready
  // For now, return mock data structure
  return {
    loading,
    data: {
      activeProjects: 0,
      teamMembers: 0,
      completedTasks: 0,
      pendingTasks: 0,
    },
  }
}

