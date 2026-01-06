import React from 'react'

import {
  CloseOutlined,
  DeleteOutlined,
  DownloadOutlined,
  EditOutlined,
  PaperClipOutlined,
  PlusOutlined,
  SaveOutlined,
  UploadOutlined,
} from '@ant-design/icons'
import { Form, FormInstance, Popconfirm, Space, UploadFile, notification } from 'antd'
import { Button, Collapse, Input, Select, Table, Upload } from 'antd'
import { ColumnsType } from 'antd/es/table'

import { UserInfoType } from 'api/authApi.types'
import { GRDocumentItemType } from 'api/grApi.types'
import { useFileValidation } from 'hooks/useFileValidation'

import CustomDatePicker from 'components/CustomDatePicker'
import {
  GR_DOC_TYPES_LABEL_VALUE, // isGRDoctypeRequireBudgetCode,
} from 'features/goodReceive/constant'

import { formatToLocalDateTime } from 'utils/dateHelpers'

// import GRSearchBudgetItemInput from '../GRSearchBudgetItemInput'

const { Option } = Select

interface GRAttachmentProps {
  attachFiles: GRDocumentItemType[]
  // setAttachFiles: React.Dispatch<React.SetStateAction<GRDocumentItemType[]>>
  onDeleteAttachFile: (key: string) => void
  onAddGRAttachment: (record: GRDocumentItemType, formValues: object) => void
  onChangeGRFileUpload: (file: UploadFile, record: GRDocumentItemType) => void
  isLoadingGRDocuments?: boolean
  GRAForm: FormInstance
  onChangeGRAttachItems: (
    record: GRDocumentItemType,
    key: string,
    value: string | number | null | boolean | undefined,
  ) => void
  isDeletingGRDocument?: boolean
  onDownloadGRAttachment: (record: GRDocumentItemType) => void
  onEditGRAttachment: (record: GRDocumentItemType) => void
  onSaveGRAttachmentEditingRecord: (record: GRDocumentItemType) => void
  onCancelGRAttachmentEditingRecord: (record: GRDocumentItemType) => void
  isUpdatingGR: boolean
  user: UserInfoType | null
  isDisabledAllForm: boolean
}

const GRAttachment: React.FC<GRAttachmentProps> = ({
  attachFiles,
  onDeleteAttachFile,
  onAddGRAttachment,
  onChangeGRFileUpload,
  isLoadingGRDocuments,
  GRAForm,
  onChangeGRAttachItems,
  isDeletingGRDocument,
  onDownloadGRAttachment,
  onEditGRAttachment,
  onSaveGRAttachmentEditingRecord,
  onCancelGRAttachmentEditingRecord,
  isUpdatingGR,
  isDisabledAllForm,
}: GRAttachmentProps) => {
  // const getValidateStatus = (record: GRDocumentItemType, key: string) => {
  //   if (key === 'budgetCode') {
  //     const value = record[key]
  //     if (value === '') {
  //       return 'success' // TODO fix validation for budgetCode
  //     } else {
  //       return 'success'
  //     }
  //   }
  // }
  const { validateFile, fileUploadHint } = useFileValidation()
  // const [isFocusingBudgetCode, setIsFocusingBudgetCode] = React.useState(false)

  const columns: ColumnsType<GRDocumentItemType> = [
    { title: 'No', dataIndex: 'no', key: 'no', align: 'center' },
    {
      title: (
        <>
          {/* <span style={{ color: 'red' }}>*</span> */}
          {/* {isFocusingBudgetCode ? 'D.Type' : 'Document Type'} */}
          Document Type
        </>
      ),
      dataIndex: 'documentType',
      key: 'documentType',
      align: 'center',
      width: 200,
      render: (_, record) => {
        return (
          <Form.Item
            name={`documentType-${record.key}`}
            rules={[{ required: true, message: 'Please select document type!' }]}
          >
            <Select
              placeholder="< Select >"
              style={{ width: '100%' }}
              onChange={(value) => {
                onChangeGRAttachItems(record, 'documentType', value)
              }}
              disabled={!(record.isNewRow || record.isEditing) || isDisabledAllForm}
            >
              {/* <Option key="INVOICE">Invoice</Option>
              <Option key="IMPORT_EXPENSE">Import Expense</Option> */}
              {/* get options from GR_DOC_TYPES */}
              {GR_DOC_TYPES_LABEL_VALUE.map((item) => (
                <Option key={item.label} value={item.value}>
                  {item.label}
                </Option>
              ))}
            </Select>
          </Form.Item>
        )
      },
    },
    {
      title: (
        <>
          {/* <span style={{ color: 'red' }}>*</span> */}
          {/* {isFocusingBudgetCode ? 'D.No' : 'Document No.'} */}
          Document No.
        </>
      ),
      dataIndex: 'documentNo',
      key: 'documentNo',
      align: 'center',
      width: 200,
      render: (_, record) => (
        <Form.Item
          name={`documentNo-${record.key}`}
          rules={[{ required: true, message: 'Please input document no.!' }]}
        >
          <Input
            onChange={(e) => {
              onChangeGRAttachItems(record, 'documentNo', e.target.value)
            }}
            disabled={!(record.isNewRow || record.isEditing) || isDisabledAllForm}
          />
        </Form.Item>
      ),
    },
    {
      title: (
        <>
          {/* <span style={{ color: 'red' }}>*</span> */}
          {/* {isFocusingBudgetCode ? 'D.Date' : 'Document Date'} */}
          Document Date
        </>
      ),
      dataIndex: 'documentDate',
      key: 'documentDate',
      align: 'center',
      width: 150,
      render: (_, record) => (
        <Form.Item
          name={`documentDate-${record.key}`}
          rules={[{ required: true, message: 'Please select document date!' }]}
        >
          <CustomDatePicker
            style={{ width: '100%' }}
            onChange={(date) => {
              onChangeGRAttachItems(
                record,
                'documentDate',
                date ? formatToLocalDateTime(date.toString()) : '',
              )
            }}
            disabled={!(record.isNewRow || record.isEditing) || isDisabledAllForm}
          />
        </Form.Item>
      ),
    },
    {
      title: (
        <>
          {/* <span style={{ color: 'red' }}>*</span> */}
          File Name
        </>
      ),
      dataIndex: 'fileName',
      key: 'fileName',
      align: 'center',
      width: 250,
      render: (_, record) => (
        <Form.Item
          name={`fileName-${record.key}`}
          rules={[
            {
              validator: async () => {
                if (record?.file?.name || record?.fileUrl !== '') {
                  return Promise.resolve()
                } else {
                  return Promise.reject(new Error('Please upload a file'))
                }
              },
            },
          ]}
        >
          <>
            <Upload
              maxCount={1}
              beforeUpload={(file) => {
                // const isLt10M = file.size / 1024 / 1024 < 5
                // if (!isLt10M) {
                //   message.error('File must be smaller than 5MB!')
                //   return Upload.LIST_IGNORE
                // }
                // return false

                const result = validateFile(file)
                return result
              }}
              onChange={(info) => {
                const { file } = info
                onChangeGRFileUpload(file, record)
              }}
              fileList={
                // record.file
                //   ? [
                //       {
                //         ...record.file,
                //         // status: 'done', // Ensure the file is marked as uploaded
                //       } as UploadFile,
                //     ]
                //   : []
                []
              }
              showUploadList={{
                showRemoveIcon: false, // Disable the delete file button
                showPreviewIcon: false, // Disable the preview file button
                showDownloadIcon: false, // Disable the download file button
              }}
              hasControlInside={false}
            >
              {/* แสดงปุ่ม Upload เมื่อ กำลังแก้ไข หรือ เป็น record ใหม่ */}
              {record.isNewRow || record.isEditing ? (
                <Button
                  color="primary"
                  variant="outlined"
                  size="small"
                  icon={<UploadOutlined />}
                  onClick={() => {
                    // handleUploadGRAttachment(record)
                  }}
                  disabled={!(record.isNewRow || record.isEditing) || isDisabledAllForm}
                >
                  Upload New File
                </Button>
              ) : null}
            </Upload>
            {record.file?.name ? (
              record.file?.name
            ) : record.fileName ? (
              record.fileName
            ) : (
              <p style={{ marginTop: 0, fontSize: 10 }}>{fileUploadHint}</p>
            )}
          </>
        </Form.Item>
      ),
    },
    // {
    //   title: 'Budget Code.',
    //   dataIndex: 'budgetCode',
    //   key: 'budgetcode',
    //   align: 'center',
    //   width: isFocusingBudgetCode ? 600 : 300,
    //   render: (text, record) => (
    //     <Form.Item
    //       name={`budgetCode-${record.key}`}
    //       rules={[
    //         {
    //           validator: async () => {
    //             if (isGRDoctypeRequireBudgetCode(record.documentType)) {
    //               if (text) {
    //                 return Promise.resolve()
    //               }
    //               return Promise.reject(new Error('Please input budget no.!'))
    //             }

    //             return Promise.resolve()
    //           },
    //         },
    //       ]}
    //       // validateStatus={getValidateStatus(record, 'budgetCode')}
    //     >
    //       {isGRDoctypeRequireBudgetCode(record.documentType) ? (
    //         <GRSearchBudgetItemInput
    //           budgetTypeId={1}
    //           user={user}
    //           onSetInputValue={(v) => {
    //             onChangeGRAttachItems(record, 'budgetCode', v)
    //           }}
    //           onClickButton={() => {}}
    //           inputValue={text}
    //           disabled={!(record.isNewRow || record.isEditing)}
    //           onFocus={() => {
    //             setIsFocusingBudgetCode(true)
    //           }}
    //           onBlur={() => {
    //             setIsFocusingBudgetCode(false)
    //           }}
    //           width={isFocusingBudgetCode ? 600 : 300}
    //         />
    //       ) : (
    //         text
    //       )}
    //     </Form.Item>
    //   ),
    // },
    // {
    //   title: 'Price',
    //   dataIndex: 'price',
    //   key: 'price',
    //   align: 'center',
    //   width: 150,
    //   render: (_, record) => {
    //     return (
    //       <Form.Item
    //         name={`price-${record.key}`}
    //         rules={[
    //           {
    //             required: isGRDoctypeRequireBudgetCode(record.documentType) ? true : false,
    //             message: 'Please input price!',
    //           },
    //         ]}
    //       >
    //         {isGRDoctypeRequireBudgetCode(record.documentType) ? (
    //           <InputNumber
    //             style={{ width: '100%' }}
    //             onChange={(value) => {
    //               onChangeGRAttachItems(record, 'price', value)
    //             }}
    //             disabled={!(record.isNewRow || record.isEditing)}
    //           />
    //         ) : (
    //           <></>
    //         )}
    //       </Form.Item>
    //     )
    //   },
    // },
    {
      title: 'Action',
      key: 'action',
      align: 'center',
      fixed: 'right',
      render: (_, record) => {
        if (record.isNewRow) {
          return (
            <Button
              disabled={isDisabledAllForm}
              icon={<PlusOutlined />}
              size="small"
              onClick={() => {
                const formValues = GRAForm.getFieldsValue()
                onAddGRAttachment(record, formValues)
              }}
            />
          )
        }

        // NOTE: Editing Row
        if (record.isEditing === true) {
          return (
            <Space size="small">
              <Button
                disabled={isDisabledAllForm}
                icon={<SaveOutlined />}
                onClick={() => onSaveGRAttachmentEditingRecord(record)}
                type="primary"
                size="small"
              />
              <Popconfirm
                title="Discard changes?"
                onConfirm={() => onCancelGRAttachmentEditingRecord(record)}
              >
                <Button
                  size="small"
                  color="primary"
                  variant="outlined"
                  icon={<CloseOutlined />}
                  disabled={isDisabledAllForm}
                />
              </Popconfirm>
            </Space>
          )
        }

        if (record.isNewRow === false) {
          return (
            // Existing Row
            <>
              {/* <Button
              danger
              icon={<DeleteOutlined />}
              size="small"
              onClick={() => {
                if (record.key) {
                  onDeleteAttachFile(record.key)
                } else {
                  console.error('record.key is undefined')
                  // error notification
                  notification.error({
                    message: 'Error',
                    description: 'Failed to delete the attachment. Record key is undefined.',
                  })
                }
              }}
            /> */}
              <Space size="small">
                <Button
                  type="primary"
                  icon={<DownloadOutlined />}
                  size="small"
                  onClick={() => onDownloadGRAttachment(record)}
                />

                <>
                  <Button
                    color="primary"
                    variant="outlined"
                    icon={<EditOutlined />}
                    onClick={() => onEditGRAttachment(record)}
                    size="small"
                    // disabled={editingKey !== null}
                    disabled={isDisabledAllForm}
                  />
                  <Popconfirm
                    title="Delete this row?"
                    onConfirm={() => {
                      if (record.key) {
                        onDeleteAttachFile(record.key)
                      } else {
                        console.error('record.key is undefined')
                        // error notification
                        notification.error({
                          message: 'Error',
                          description: 'Failed to delete the attachment. Record key is undefined.',
                        })
                      }
                    }}
                  >
                    <Button
                      danger
                      type="primary"
                      icon={<DeleteOutlined />}
                      size="small"
                      disabled={isDisabledAllForm}
                      // disabled={editingKey !== null}
                    />
                  </Popconfirm>
                </>
              </Space>
            </>
          )
        }
      },
    },
  ]

  const items = [
    {
      key: '1',
      label: (
        <span>
          <PaperClipOutlined /> Attachment/แนบเอกสาร And Import Expense / ค่าใช้จ่ายการนำเข้าสินค้า
        </span>
      ),
      children: (
        <>
          <Form form={GRAForm}>
            <Table
              bordered
              tableLayout="auto"
              columns={columns}
              dataSource={attachFiles}
              pagination={false}
              size="small"
              scroll={{ x: true }}
              loading={isLoadingGRDocuments || isDeletingGRDocument || isUpdatingGR}
            />
          </Form>
        </>
      ),
    },
  ]
  return <Collapse items={items} defaultActiveKey={['1']} expandIconPosition="end" />
}

export default GRAttachment
