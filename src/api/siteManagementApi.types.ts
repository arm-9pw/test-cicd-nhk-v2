export type SiteManagementResponseType = {
  organizationId: string
  organizationName: string
  organizationCode: string
  taxId: string
  siteName: string
  siteBranchNo: string
  siteBranchName: string
  addressTh: string
  addressEn?: string
  provinceTh: string
  provinceEn?: string
  countryTH?: string
  countryEN?: string
  tel: string
  email: string
  siteShortCode: string
  id: string
}

export type OrganizationResponseType = {
  code: string
  name: string
  alternativeName: string
  structureLevel: string
  siteCode: string
  parentCode: string
  id: string
}