import { PDFViewer, usePDF } from '@react-pdf/renderer'
import { Button, Result, Spin } from 'antd'
import { PurchaseOrderRespType } from 'api/poApi.types'
import PdfBCSRender from './PdfBCSRender'

const PdfBCSContainer = ({ poData }: { poData: PurchaseOrderRespType }) => {
  const [instance, updateInstance] = usePDF({
    document: PdfBCSRender({ poData }),
  })

  return (
    <Spin spinning={instance.loading} tip="Rendering PDF...">
      <div style={{ height: '85vh' }}>
        {instance.error && (
          <Result
            status="error"
            title="Cannot render PDF"
            subTitle="If the problem persists, please contact support."
            extra={
              <Button type="primary" onClick={() => updateInstance(PdfBCSRender({ poData }))}>
                Render Again
              </Button>
            }
          />
        )}
        <PDFViewer style={{ width: '100%', height: '100%' }}>
          {PdfBCSRender({ poData })}
        </PDFViewer>
      </div>
    </Spin>
  )
}

export default PdfBCSContainer 