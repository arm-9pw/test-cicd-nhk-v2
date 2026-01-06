import { useCallback, useEffect, useMemo, useState } from 'react'
import { useLocation } from 'react-router-dom'

import { menuRoutes } from 'routes/menuRoutes'

const useSideMenu = () => {
  const { pathname } = useLocation()
  const [selectedMenu, setSelectedMenu] = useState<string[]>([])
  const [openedSubMenu, setOpenedSubMenu] = useState<string[]>([])

  const isMenuRoute = useMemo(() => {
    return Object.values(menuRoutes).some((route) => pathname === route.path)
  }, [pathname])

  const getOpenKeysFromPathname = (path: string): string[] => {
    const parts = path.split('/').filter(Boolean) // Split path and remove empty parts

    const routes = []
    let currentRoute = ''

    for (let i = 0; i < parts.length; i++) {
      currentRoute += '/' + parts[i] // Append the current part to the current route
      routes.push(currentRoute) // Add the current route to the list of routes
    }

    return routes
  }

  const onOpenChange = (openKeys: string[]) => {
    setOpenedSubMenu(openKeys)
  }

  const onSetSelectedMenuByPath = useCallback(() => {
    if (isMenuRoute) setSelectedMenu([pathname])
  }, [pathname, isMenuRoute])

  const onSetOpenedMenuFromPathname = useCallback(() => {
    if (isMenuRoute) {
      const openKeys = getOpenKeysFromPathname(pathname)
      setOpenedSubMenu(openKeys)
    }
  }, [pathname, isMenuRoute])

  useEffect(() => {
    onSetSelectedMenuByPath()
    onSetOpenedMenuFromPathname()
  }, [onSetSelectedMenuByPath, onSetOpenedMenuFromPathname])

  return {
    openedSubMenu,
    onOpenChange,
    selectedMenu,
    onSetSelectedMenuByPath,
  }
}

export default useSideMenu
