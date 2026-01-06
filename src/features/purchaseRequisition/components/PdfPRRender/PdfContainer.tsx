import { PDFViewer, usePDF } from '@react-pdf/renderer'

import { Button, Result, Spin } from 'antd'

import { PurchaseRequisitionRespType } from 'api/prApi.types'

// import { mockItemsForPdf2 } from 'mocks/pr'
import PdfPRRender from '.'

const PdfContainer = ({ prData }: { prData: PurchaseRequisitionRespType }) => {
  const [instance, updateInstance] = usePDF({
    document: PdfPRRender({ prData }),
  })

  return (
    <Spin spinning={instance.loading} tip="Rendering PDF...">
      <div
        style={{
          height: '85vh',
        }}
      >
        {instance.error && (
          <Result
            status="error"
            title="Cannot render PDF"
            subTitle="If the problem persists, please contact support."
            extra={
              <Button
                type="primary"
                onClick={() =>
                  updateInstance(
                    PdfPRRender({
                      prData,
                    }),
                  )
                }
              >
                Render Again
              </Button>
            }
          />
        )}
        <PDFViewer style={{ width: '100%', height: '100%' }}>{PdfPRRender({ prData })}</PDFViewer>
      </div>
    </Spin>
  )
}

export default PdfContainer
