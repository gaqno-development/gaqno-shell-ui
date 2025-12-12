import { useRoleBasedAccess } from '@gaqno-dev/frontcore/hooks/useRoleBasedAccess'
import { UserRole } from '@gaqno-dev/frontcore/types/user'

export const useManagerDashboard = () => {
  const { isAuthorized, loading } = useRoleBasedAccess(UserRole.MANAGER)

  return {
    isAuthorized,
    loading,
  }
}

