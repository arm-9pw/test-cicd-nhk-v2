type TAccessControl = {
  isEnable: boolean
  isVisible: boolean
}

export type TElementAccess = {
  id: string
  elementId: string
  elementDescription: string
  accessControl: TAccessControl
}

export type PermissionType = {
  id: string
  name: string
  code: string
  description: string
  elementAccessList: TElementAccess[]
}

export type TUserInfo = {
  id: string
  username: string
  permissions: PermissionType[]
}

export type TLoginCredentials = {
  username: string
  password: string
}
