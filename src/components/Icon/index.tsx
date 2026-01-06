import React from 'react'

import BellIcon from 'assets/icons/ic-bell-area-outline.svg'

interface IconProps extends React.SVGProps<SVGSVGElement> {
  name: 'Bell' // Add more icon names as needed
}

const iconComponents = {
  Bell: BellIcon,
  // Add more icons here as you create them
}

const Icon: React.FC<IconProps> = ({ name, ...props }) => {
  const IconComponent = iconComponents[name as keyof typeof iconComponents]
  return <IconComponent {...props} />
}

export default Icon
