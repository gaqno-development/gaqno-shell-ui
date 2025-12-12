import { useSupabaseQuery } from '@gaqno-dev/frontcore/hooks/useSupabaseQuery'
import { api } from '@gaqno-dev/frontcore/lib/api'
import { IUserProfile } from '@gaqno-dev/frontcore/types/user'

export const useUsers = () => {
  return useSupabaseQuery<IUserProfile[]>(
    ['users'],
    () => api.users.getAll()
  )
}

