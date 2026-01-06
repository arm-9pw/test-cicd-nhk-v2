import { useCallback, useEffect, useState } from 'react'

import { PurchaseRequisitionRespType } from 'api/prApi.types.js'
import pdfMake from 'pdfmake/build/pdfmake'

// Import utility functions from the separate file
import { createPRDocumentDefinition } from './PRpdfUtils'

type PRpdfBuilderProps = {
  prData: PurchaseRequisitionRespType
}

/**
 * Component that renders a Purchase Requisition PDF preview
 */
const PRpdfBuilder = ({ prData }: PRpdfBuilderProps) => {
  const [pdfUrl, setPdfUrl] = useState<string | null>(null)

  const generatePdf = useCallback(() => {
    // Use the imported function to create the document definition
    const documentDefinition = createPRDocumentDefinition(prData)

    // Generate blob for preview
    pdfMake.createPdf(documentDefinition).getBlob((blob) => {
      const url = URL.createObjectURL(blob)
      setPdfUrl(url)
    })
  }, [prData])

  useEffect(() => {
    generatePdf()
  }, [generatePdf])

  return (
    <div>
      {pdfUrl && (
        <iframe src={pdfUrl} style={{ width: '100%', height: '80vh' }} title="PDF Preview" />
      )}
    </div>
  )
}

export default PRpdfBuilder
