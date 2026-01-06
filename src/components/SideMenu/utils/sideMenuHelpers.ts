import { PermissionType } from 'features/auth/auth.types'

import { TSideMenuItem, sideMenuItems } from '../sideMenuItems'

const filterMenuByPermissions = (
  menuList: TSideMenuItem[],
  permissions: PermissionType[],
) => {
  return menuList.reduce<TSideMenuItem[]>((filteredMenu, menuItem) => {
    // Check if the menu item has permission
    if (
      menuItem?.permission &&
      permissions?.some((perm) => perm?.code === menuItem?.permission)
    ) {
      // If it has permission, add it to the filtered menu
      if (menuItem?.children) {
        // If it has children, filter them recursively
        const filteredChildren = filterMenuByPermissions(
          menuItem.children,
          permissions,
        )
        if (filteredChildren.length > 0) {
          // Only add the parent if its children have permission
          filteredMenu.push({
            ...menuItem,
            children: filteredChildren,
          })
        }
      } else {
        filteredMenu.push(menuItem)
      }
    } else if (menuItem?.children) {
      // If it doesn't have permission but has children, filter the children
      const filteredChildren = filterMenuByPermissions(
        menuItem.children,
        permissions,
      )
      if (filteredChildren.length > 0) {
        // Add the parent node with filtered children
        filteredMenu.push({
          ...menuItem,
          children: filteredChildren,
        })
      }
    }
    return filteredMenu
  }, [])
}

export const getFilteredMenuList = (permissions: PermissionType[]) => {
  return filterMenuByPermissions(sideMenuItems, permissions)
}
