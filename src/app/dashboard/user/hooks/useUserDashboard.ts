import { useRoleBasedAccess } from '@gaqno-dev/frontcore/hooks/useRoleBasedAccess'
import { UserRole } from '@gaqno-dev/frontcore/types/user'

export const useUserDashboard = () => {
  const { isAuthorized, loading } = useRoleBasedAccess(UserRole.USER)

  return {
    isAuthorized,
    loading,
  }
}

