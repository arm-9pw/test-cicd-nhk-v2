import { useCallback, useEffect, useState } from 'react'

import { PurchaseOrderRespType } from 'api/poApi.types.js'
import pdfMake from 'pdfmake/build/pdfmake'

// Import utility functions from the separate file
import { createPODocumentDefinition } from './POpdfUtils'

type POpdfBuilderProps = {
  poData: PurchaseOrderRespType
}

/**
 * Component that renders a Purchase Order PDF preview
 */
const POpdfBuilder = ({ poData }: POpdfBuilderProps) => {
  const [pdfUrl, setPdfUrl] = useState<string | null>(null)

  const generatePdf = useCallback(() => {
    // Use the imported function to create the document definition
    const documentDefinition = createPODocumentDefinition(poData)

    // Generate blob for preview
    pdfMake.createPdf(documentDefinition).getBlob((blob) => {
      const url = URL.createObjectURL(blob)
      setPdfUrl(url)
    })
  }, [poData])

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

export default POpdfBuilder
