import { menuRoutes } from 'routes/menuRoutes'

export function getLandingPagePath(currentLandingPageCode: string): string {
  for (const route of Object.values(menuRoutes)) {
    if (route.permission === currentLandingPageCode) {
      return route.path
    }
  }
  return '/'
}
