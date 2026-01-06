import { UploadFile } from 'antd'

export type requesterInfoType = {
  requesterId?: string
  requesterName?: string
  requesterSite?: string
  requesterSection?: string
  requesterSectionId?: string
}

export type TPOGRPOItem = {
  deliveryDate: string
  budgetId: string
  budgetCode: string
  budgetSiteId: string
  budgetSiteName: string
  name: string
  model: string
  brand: string
  detail: string
  qty: string
  unit: string
  unitPrice: string
  unitDiscount: string
  netTotal: string
  id: string
  key?: string
  isNewRow?: boolean
}

export type TPOGRItem = {
  id: string
  poNo: string
  poDate: string
  supplierName: string
  paymentTermId: string
  paymentTermName: string
  receiveCondition: string
  grNo: string
  grDate: string
  prNo: string
  prDate: string
  purchaseOrderItems: Array<TPOGRPOItem>
}

export type TPOGRRemainingItem = {
  id: string
  poNo: string
  poDate: string
  supplierName: string
  paymentTermId: string
  paymentTermName: string
  receiveCondition: string
  grNo: string
  grDate: string
  prNo: string
  prDate: string
  comment: string
  purchaseOrderItems: Array<PurchaseOrderItemType>
}

export type TPOGRItems = Partial<TPOGRItem[]>

export type TSupplierListResponse = {
  message: string
  data: {
    id: string
    supplierName: string
  }[]
}

export type TPOGRItemQueryParams = {
  poNo: string
  page?: string
  sizePerPage?: string
}

export type TPOGRItemRemainingQueryParams = {
  id: string
  page?: string
  sizePerPage?: string
}

export type GRinvoiceItem = {
  GRIname: string
  GRImodel: string
  GRIbrand: string
  GRIdetail: string
  GRIqty: number
  GRIunit: string
  GRIunitPrice: number
  GRInetTotal: number | string
  GRIinvoiceReceiveName: string
  GRIinvoiceNo: string
  GRIinvoiceDate: string
  GRIpaidDate: string
  GRIid: string | null | undefined
  GRIremark: string
  GRIisNewRow?: boolean
  //
  GRIkey?: string
  GRIno?: number
  GRImaxReceiveQty?: number
  GRImaxReceivePrice?: number
  matCode: string | null
}

// example data
// "name":"Laptop",
// "model":"ThinkPad X1 Carbon Gen 10",
// "brand":"Lenovo",
// "detail":null,
// "qty":0.00,
// "unit":"0",
// "unitPrice":45000.00,
// "netTotal":0.00,
// "invoiceReceiveName":null,
// "invoiceNo":null,
// "invoiceDate":null,
// "id":659668672083399295
export type GoodReceiveItemType = {
  name: string
  model: string
  brand: string
  detail: string
  qty: number
  unit: string
  unitPrice: number
  netTotal: number
  invoiceReceiveName: string
  invoiceNo: string
  invoiceDate: string
  paidDate: string
  id: string | null | undefined
  remark: string
  matCode: string | null
}

export type PurchaseOrderItemType = {
  id: string
  name: string
  model: string
  brand: string
  detail: string
  receiveQty: number
  receivePrice: number
  receiveTotal: number
  matCode: string | null
}

export type GetGRHistoryParams = {
  poId: string
}

export type GoodReceiveHistoryItem = {
  id: string
  name: string
  model: string
  brand: string
  detail: string
  receiveQty: string
  receivePrice: string
  receiveTotal: string
  invoiceReceiveName: string
  invoiceNo: string
  invoiceDate: string
  paidDate: string
  remark: string
}

export type GRHistoryDataType = {
  goodReceiveHistories: {
    id: string
    grNo: string
    grDate: string
    goodReceiveHistoryItems: GoodReceiveHistoryItem[]
  }[]
}

// MAY'S NOTE: อย่าประกาศ Type แบบนี้อีก มันแปลว่าใน array จะมี 1 member เท่านั้น
// export type GRHistoryDataType = {
//   goodReceiveHistories: [
//     {
//       id: string
//       grNo: string
//       grDate: string
//       goodReceiveHistoryItems: [
//         {
//           id: string
//           name: string
//           model: string
//           brand: string
//           detail: string
//           receiveQty: string
//           receivePrice: string
//           receiveTotal: string
//           invoiceReceiveName: string
//           invoiceReceiveNo: string
//           invoiceDate: string
//           paidDate: string
//         },
//       ]
//     },
//   ]
// }

export type updateGRParams = {
  method: string
  urlSuffix: string
  data: {
    id: string
    poNo: string
    poDate: string
    supplierName: string
    paymentTermId: string
    paymentTermName: string
    receiveCondition: string
    grNo: string
    grDate: string
    prNo: string
    prDate: string
    comment: string
    purchaseOrderItems: Array<GRinvoiceItem>
  }
}

export type GRDocumentItemType = {
  documentNo: string
  documentDate: string
  fileName: string
  fileUrl: string
  fileSize: string
  mimeType: string
  domain: string
  refId: string
  documentType: string
  id: string
  key?: string
  no: number
  isNewRow?: boolean
  budgetNo?: string
  budgetCode?: string
  price?: string
  file?: UploadFile
  isFileExistOnLocal?: boolean
  isEditing?: boolean
  backupRecord?: GRDocumentItemType
}

// Example data for CREATE mode
// {
//   "purchaseOrderId": 651272024904020467,
//   "comment": "รับสินค้าตามใบสั่งซื้อ",
//   "goodReceiveItems": [
//     {
//       "name": "สินค้า A",
//       "model": "MODEL-A",
//       "brand": "BRAND-A",
//       "unit": "unit",
//       "detail": "รายละเอียดสินค้า A",
//       "qty": 10,
//       "unitPrice": 1000.00,
//       "netTotal": 10000.00
//     }
//   ],
//   "documentAttachFiles": [
//     {
//       "domain": "PURCHASE_REQUISITION",
//       "documentType": "QUOTATION",
//       "documentNo": "TTT",
//       "documentDate": "2024-11-13T00:00:00",
//       "fileName": "pngtest.png"
//     }
//   ]
// }

export type createGRRequestDataType = {
  data: {
    purchaseOrderId: string
    comment: string
    goodReceiveItems: Array<Partial<GoodReceiveItemType>>
    documentAttachFiles: Array<Partial<GRDocumentItemType>>
    requesterId?: string
    requesterName?: string
    requesterSite?: string
    requesterSection?: string
    requesterSectionId?: string
  }
  files: Array<Partial<GRDocumentItemType>>
}

export type createGRResponseDataType = {
  id: string
  grNo: string
  grDate: string
  purchaseOrderId: string
  comment: string
  goodReceiveItems: Array<GoodReceiveItemType>
  documentAttachFiles: Array<Partial<GRDocumentItemType>>
  requesterId?: string
  requesterName?: string
  requesterSite?: string
  requesterSection?: string
}

export type updateGRRequestDataType = {
  purchaseOrderId: string
  id: string
  grNo: string
  grDate: string
  comment: string
  purchaseStatus: string
  goodReceiveItems: Array<Partial<GoodReceiveItemType>>
  requesterId?: string
  requesterName?: string
  requesterSite?: string
  requesterSection?: string
  requesterSectionId?: string
}

export type updateGRResponseDataType = {
  id: string
  poNo: string
  poDate: string
  supplierName: string
  paymentTermId: string
  paymentTermName: string
  receiveCondition: string
  grNo: string
  grDate: string
  prNo: string
  prDate: string
  comment: string
  goodReceiveItems: Array<GoodReceiveItemType>
  requesterId?: string
  requesterName?: string
  requesterSite?: string
  requesterSection?: string
}

export type CreateGRdocumentRequestType = {
  metadata: {
    id: string
    refId: string
    domain: string
    documentType: string
    documentNo: string
    documentDate: string
    fileName: string
    price?: string
    budgetCode?: string
    requesterId?: string
    requesterName?: string
    requesterSite?: string
    requesterSection?: string
  }
  file: UploadFile
}

export type UpdateGRdocumentRequestType = {
  metadata: {
    id: string
    refId: string
    domain: string
    documentType: string
    documentNo: string
    documentDate: string
    fileName: string
    price?: string
    budgetCode?: string
    requesterId?: string
    requesterName?: string
    requesterSite?: string
    requesterSection?: string
  }
  file: UploadFile
}

// example GRbyIdDataType:
// {
//   "purchaseOrderId": 651272024904020500,
//   "grNo": "GR-fdbfdb08",
//   "grDate": "2025-01-23T07:15:07.987096",
//   "comment": null,
//   "purchaseStatus": "GR_PENDING",
//   "purchaseOrder": {
//       "poNo": "PO-9b188caf",
//       "poDate": "2024-12-02T04:02:30.68011",
//       "jobName": "Test Job",
//       "purchaserId": null,
//       "purchaserName": "JJ",
//       "purchaserSite": "BangKaPi",
//       "purchaserSection": "HO",
//       "purchaserSectionId": null,
//       "mainGroupId": 641160946715114500,
//       "mainGroupName": "Supply Equipment",
//       "deliveryDate": "2024-11-13T00:00:00",
//       "budgetId": 646796834166019100,
//       "budgetCode": "OB2024-001",
//       "budgetDescription": "2024 Budget",
//       "budgetTypeId": null,
//       "budgetTypeName": null,
//       "siteDeliveryId": 649894383991157800,
//       "siteDeliveryName": "seven-eleven",
//       "siteInvoiceTaxId": 649894809603961900,
//       "siteInvoiceTaxName": "invoice01",
//       "isImport": false,
//       "currencyId": 641162870508140400,
//       "currencyName": "THB",
//       "exchangeRateSource": 1,
//       "exchangeRateDestination": 1,
//       "supplierAttention": "Test CO.,LTD",
//       "supplierAttentionPosition": "Manager",
//       "supplierId": 646653718170174500,
//       "supplierCode": "ST01",
//       "supplierName": "Supplier Test 001",
//       "supplierAddress": "123 Silom Road, Bangrak, Bangkok 10500",
//       "supplierTelephone": "099999999",
//       "supplierEmail": null,
//       "paymentTermId": 647501485272331300,
//       "paymentTermName": "payment term test",
//       "paymentTermDescription": "payment term description",
//       "itemGrandTotal": 215000,
//       "monetaryBaht": 215000,
//       "vatPercentage": 7,
//       "vatBaht": 15050,
//       "grandMonetaryBaht": 230050,
//       "monetaryWordEn": "Two hundred thirty-eight thousand six hundred ten baht only",
//       "monetaryWordTh": "สองแสนสามหมื่นแปดพันหกร้อยสิบบาทถ้วน",
//       "purchaseStatus": "PO_APPROVED",
//       "remarkItem": "remark item",
//       "documentRoute": "document Route",
//       "remarkBudgetControlSheet": null,
//       "isReferPr": null,
//       "isShowDescription": null,
//       "purchaseOrderItems": [
//           {
//               "budgetId": 646796834166019100,
//               "budgetCode": "OB2024-001",
//               "budgetSiteId": 1,
//               "budgetSiteName": "test site",
//               "name": "Laptop",
//               "model": "ThinkPad X1 Carbon Gen 10",
//               "brand": "Lenovo",
//               "detail": null,
//               "qty": 0,
//               "unit": "unit",
//               "unitPrice": 45000,
//               "unitDiscount": 2000,
//               "netTotal": 172000,
//               "id": 651272026103591400
//           },
//           {
//               "budgetId": 646796834166019100,
//               "budgetCode": "OB2024-001",
//               "budgetSiteId": 1,
//               "budgetSiteName": "test site",
//               "name": "Monitor",
//               "model": "UltraSharp U2723QE",
//               "brand": "Dell",
//               "detail": null,
//               "qty": 0,
//               "unit": "unit",
//               "unitPrice": 15000,
//               "unitDiscount": 1000,
//               "netTotal": 28000,
//               "id": 651272026128757200
//           },
//           {
//               "budgetId": 646796834166019100,
//               "budgetCode": "OB2024-001",
//               "budgetSiteId": 1,
//               "budgetSiteName": "test site",
//               "name": "Keyboard",
//               "model": "MX Keys",
//               "brand": "Logitech",
//               "detail": null,
//               "qty": 0,
//               "unit": "unit",
//               "unitPrice": 3500,
//               "unitDiscount": 500,
//               "netTotal": 15000,
//               "id": 651272026137145900
//           }
//       ],
//       "purchaseOrderBudgetControlSheets": [
//           {
//               "budgetSiteId": 638772113209959600,
//               "budgetSiteName": "Bangkok HQ",
//               "budgetId": 646796834166019100,
//               "budgetYear": "2024",
//               "mainBudgetCode": "OB2024-001",
//               "mainBudgetAmount": 1200000,
//               "subBudgetCode": null,
//               "subBudgetAmount": null,
//               "pendingAmount": 0,
//               "approveAmount": 1200000,
//               "thisOrderAmount": 215000,
//               "purchaseOrderAmount": 0,
//               "budgetRemain": 985000,
//               "isOverBudget": false,
//               "budgetStatus": "NOT OVER BUDGET",
//               "id": 651272026153923100
//           }
//       ],
//       "documentAttachFiles": null,
//       "purchaseRequisitions": null,
//       "id": 651272024904020500
//   },
//   "goodReceiveItems": [
//       {
//           "name": "Laptop",
//           "model": "ThinkPad X1 Carbon Gen 10",
//           "brand": "Lenovo",
//           "detail": "1",
//           "qty": 0,
//           "unit": "",
//           "unitPrice": 45000,
//           "netTotal": 0,
//           "invoiceReceiveName": "1",
//           "invoiceNo": "1",
//           "invoiceDate": "2025-01-01T00:00:00",
//           "id": 670164669533434500
//       },
//       {
//           "name": "Monitor",
//           "model": "UltraSharp U2723QE",
//           "brand": "Dell",
//           "detail": "1",
//           "qty": 0,
//           "unit": "",
//           "unitPrice": 15000,
//           "netTotal": 0,
//           "invoiceReceiveName": "1",
//           "invoiceNo": "1",
//           "invoiceDate": "2025-01-01T00:00:00",
//           "id": 670164669541823200
//       },
//       {
//           "name": "Keyboard",
//           "model": "MX Keys",
//           "brand": "Logitech",
//           "detail": "1",
//           "qty": 0,
//           "unit": "",
//           "unitPrice": 3500,
//           "netTotal": 0,
//           "invoiceReceiveName": "1",
//           "invoiceNo": "1",
//           "invoiceDate": "2025-01-01T00:00:00",
//           "id": 670164669550211800
//       }
//   ],
//   "documentAttachFiles": [
//       {
//           "documentNo": "22",
//           "documentDate": "2025-01-02T00:00:00",
//           "domain": "GOOD_RECEIVE",
//           "refId": 670164669118198400,
//           "documentType": "INVOICE",
//           "fileName": "pngtest2.png",
//           "fileUrl": "http://epurchase-service-dev:8091/api/documents/670165020768645629/download",
//           "fileSize": "1447",
//           "mimeType": "image/png",
//           "budgetCode": "",
//           "id": 670165020768645600
//       }
//   ],
//   "id": 670164669118198400
// }
export type GRbyIdDataType = {
  purchaseOrderId: string
  grNo: string
  grDate: string
  comment: string
  purchaseStatus: string
  goodReceiveItems: Array<GoodReceiveItemType>
  documentAttachFiles: Array<Partial<GRDocumentItemType>>
  id: string
  purchaseOrder: {
    poNo: string
    poDate: string
    jobName: string
    purchaserId: string
    purchaserName: string
    purchaserSite: string
    purchaserSection: string
    purchaserSectionId: string
    mainGroupId: string
    mainGroupName: string
    deliveryDate: string
    budgetId: string
    budgetCode: string
    budgetDescription: string
    budgetTypeId: string
    budgetTypeName: string
    siteDeliveryId: string
    siteDeliveryName: string
    siteInvoiceTaxId: string
    siteInvoiceTaxName: string
    isImport: boolean
    currencyId: string
    currencyName: string
    exchangeRateSource: string
    exchangeRateDestination: string
    supplierAttention: string
    supplierAttentionPosition: string
    supplierId: string
    supplierCode: string
    supplierName: string
    supplierAddress: string
    supplierTelephone: string
    supplierEmail: string
    paymentTermId: string
    paymentTermName: string
    paymentTermDescription: string
    itemGrandTotal: number
    monetaryBaht: number
    vatPercentage: number
    vatBaht: number
    grandMonetaryBaht: number
    monetaryWordEn: string
    monetaryWordTh: string
    purchaseStatus: string
    remarkItem: string
    documentRoute: string
    remarkBudgetControlSheet: string
    isReferPr: string
    isShowDescription: string
    purchaseOrderItems: Array<PurchaseOrderItemType>
    // purchaseOrderBudgetControlSheets
    documentAttachFiles: Array<GRDocumentItemType>
    purchaseRequisitions: {
      prDate: string
      prNo: string
    }
    id: string
  }
  requesterId?: string
  requesterName?: string
  requesterSite?: string
  requesterSection?: string
  requesterSectionId?: string
}
