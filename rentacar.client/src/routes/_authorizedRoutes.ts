import { createFileRoute, redirect } from '@tanstack/react-router'
import { isAuthenticated } from '../helpers/UserHelper'

export const Route = createFileRoute('/_authorizedRoutes')({
  beforeLoad: async () => {
    const auth = await isAuthenticated()
    if (!auth) {
      throw redirect({ to: '/Login' })
    }
  }
})