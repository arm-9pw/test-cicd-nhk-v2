import { Result } from 'antd'

import ContentCard from 'components/ContentCard'
import PageHeader from 'components/PageHeader'
import ImportBudgetForm from 'features/importData/components/ImportBudgetForm'
import ImportEmployeeForm from 'features/importData/components/ImportEmployeeForm'

interface ImportDataPageProps {
  type: 'budget' | 'supplier' | 'employee' | 'organizationUnit'
}

function ImportDataPage({ type }: ImportDataPageProps) {
  let pageTitle = ''
  let render = null
  switch (type) {
    case 'budget':
      pageTitle = 'Import Budget'
      render = <ImportBudgetForm />
      break

    case 'supplier':
      pageTitle = 'Import Supplier'
      render = (
        <div style={{ marginTop: 16 }}>
          <ContentCard>
            <Result status="404" title="Coming soon" subTitle="This page is under development" />
          </ContentCard>
        </div>
      )
      break

    case 'employee':
      pageTitle = 'Import Employee'
      render = <ImportEmployeeForm />
      break

    case 'organizationUnit':
      pageTitle = 'Import Organization Unit'
      render = (
        <div style={{ marginTop: 16 }}>
          <ContentCard>
            <Result status="404" title="Coming soon" subTitle="This page is under development" />
          </ContentCard>
        </div>
      )
      break

    default:
      pageTitle = 'Import Data'
      render = <></>
  }

  return (
    <>
      <PageHeader
        pageTitle={pageTitle}
        breadcrumbItems={[
          {
            title: 'Administration',
          },
          {
            title: pageTitle,
          },
        ]}
      />
      {render}
    </>
  )
}

export default ImportDataPage
