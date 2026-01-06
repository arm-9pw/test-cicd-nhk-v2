import { useMemo } from 'react'
import { useNavigate } from 'react-router-dom'

import { Layout, Menu, theme } from 'antd'

import styles from './SideMenu.module.css'

import { useAppSelector } from 'app/hook'

import { selectPermissions } from 'features/auth/authSlice'

import useSideMenu from './hooks/useSideMenu'
import { getFilteredMenuList } from './utils/sideMenuHelpers'

const { Sider } = Layout

const SideMenu = () => {
  const navigate = useNavigate()
  const permissions = useAppSelector(selectPermissions)
  const { openedSubMenu, onOpenChange, selectedMenu } = useSideMenu()

  const {
    token: { colorBgContainer },
  } = theme.useToken()

  const menuItems = useMemo(() => getFilteredMenuList(permissions || []), [permissions])

  return (
    <Sider
      breakpoint="lg"
      collapsedWidth="50"
      width={260}
      style={{ background: colorBgContainer, paddingTop: 16 }}
    >
      <Menu
        mode="inline"
        className={styles['side-menu']}
        selectedKeys={selectedMenu}
        openKeys={openedSubMenu}
        onOpenChange={onOpenChange}
        style={{ height: '100%', borderRight: 0 }}
        items={menuItems}
        onClick={({ key }) => {
          navigate(key)
        }}
      />
    </Sider>
  )
}

export default SideMenu
