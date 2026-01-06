// import { useState } from 'react'

// import { UploadOutlined } from '@ant-design/icons'
// import { Button, Form, FormInstance, Upload, message } from 'antd'

// import { GRDocumentItemType } from 'api/grApi'

// type Props = {
//   // formRef: FormInstance
//   record: GRDocumentItemType
// }

// const GRUploadCell = ({ 
//   // formRef, 
//   record }: Props) => {
//   const [tempUploadingFileName, setTempUploadingFileName] = useState<string>('')

//   const getEditFileName = (record: GRDocumentItemType) => {
//     if (record.fileName && tempUploadingFileName !== '') {
//       // NOTE: ถ้ามีการ upload file ใหม่ก็ไม่ต้องแสดงชื่อไฟล์เก่าแล้ว
//       return ''
//     } // NOTE: กรณีที่ Edit ให้แสดงชื่อไฟล์ปัจจุบัน
//     return record.fileName
//   }

//   return (
//     <Form form={formRef}>
//       <Form.Item name="fileName" style={{ margin: 0 }} valuePropName="fileName">
//         <Upload
//           maxCount={1}
//           beforeUpload={(file) => {
//             const isLt10M = file.size / 1024 / 1024 < 10
//             if (!isLt10M) {
//               message.error('File must be smaller than 10MB!')
//               return Upload.LIST_IGNORE
//             }
//             setTempUploadingFileName(file.name)
//             return false
//           }}
//         >
//           <Button color="primary" variant="outlined" size="small" icon={<UploadOutlined />}>
//             Upload New File
//           </Button>
//         </Upload>
//       </Form.Item>
//       <div>{getEditFileName(record)}</div>
//     </Form>
//   )
// }

// export default GRUploadCell
