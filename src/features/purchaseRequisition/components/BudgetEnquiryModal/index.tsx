// import React, { useEffect, useMemo, useState } from 'react'

// import { AccountBookOutlined, SearchOutlined } from '@ant-design/icons'
// import {
//   Button,
//   Checkbox,
//   Col,
//   Divider,
//   Form,
//   Input,
//   InputNumber,
//   Modal, // Pagination,
//   Row,
//   Table,
// } from 'antd'

// import { TBudgetEnquiryItem, useGetBudgetsQuery } from 'api/prApi'
// import { useAppDispatch } from 'app/hook'
// import { setError } from 'app/slices/errorSlice'

// import HeaderTitle from 'components/HeaderTitle'

// import { getColumns } from './columns'

// type TBudgetEnquiryFormValues = {
//   fiscalYear?: string
//   budgetCode?: string
//   assetName?: string
//   isBudgetCenterOnSite?: boolean
// }

// type BudgetEnquiryModalProps = {
//   isOpen: boolean
//   onCloseModal: () => void
//   onAddAction: (value: TBudgetEnquiryItem) => void
//   afterClose: () => void
// }

// const SPAN = { xs: 24, sm: 24, md: 16, lg: 8, xl: 8 }

// const BudgetEnquiryModal: React.FC<BudgetEnquiryModalProps> = ({
//   isOpen,
//   onCloseModal,
//   onAddAction,
//   afterClose,
// }) => {
//   const dispatch = useAppDispatch()
//   const [form] = Form.useForm()
//   const [queryParams, setQueryParams] = useState<TBudgetEnquiryFormValues>({})
//   const {
//     data = [],
//     isFetching,
//     isError,
//     error,
//     refetch,
//     // } = useGetBudgetsQuery(queryParams)
//   } = useGetBudgetsQuery({
//     organizationId: 2, // FIXME: Need to get organizationId from user API
//   })

//   const onSubmitForm = async (values: TBudgetEnquiryFormValues) => {
//     setQueryParams(values)
//     try {
//       await refetch()
//     } catch (err) {
//       console.error('Error fetching budgets:', err)
//     }
//   }

//   const columns = useMemo(
//     () => getColumns({ onAdd: onAddAction, onCloseModal }),
//     [onAddAction, onCloseModal],
//   )

//   useEffect(() => {
//     if (isError) {
//       console.error('Error fetching budgets:', error)
//       dispatch(setError('Error fetching budgets/เกิดข้อผิดพลาดในการค้นหางบประมาณ'))
//     }
//   }, [dispatch, isError, error])

//   return (
//     <Modal
//       destroyOnClose
//       title={
//         <>
//           <HeaderTitle
//             title="Budget Enquiry/ค้นหางบประมาณ"
//             titlePreIcon={<AccountBookOutlined />}
//           />
//           <Divider style={{ margin: '16px 0' }} />
//         </>
//       }
//       open={isOpen}
//       onCancel={onCloseModal}
//       width={1000}
//       footer={null}
//       afterClose={afterClose}
//     >
//       <div style={{ marginBottom: 16 }}>
//         <Form form={form} layout="vertical" onFinish={onSubmitForm}>
//           <Row gutter={[16, 0]}>
//             <Col {...SPAN}>
//               <Form.Item name="fiscalYear" label="Fiscal Year/ปีที่บันทึก">
//                 <InputNumber placeholder="Enter fiscal year" style={{ width: '100%' }} />
//               </Form.Item>
//             </Col>
//             <Col {...SPAN}>
//               <Form.Item name="budgetCode" label="Budget Code/รหัสงบประมาณ">
//                 <Input placeholder="Enter budget code" />
//               </Form.Item>
//             </Col>
//             <Col {...SPAN}>
//               <Form.Item name="assetName" label="Asset Name/ชื่อบัญชี">
//                 <Input placeholder="Enter asset name" />
//               </Form.Item>
//             </Col>
//           </Row>
//           <Row>
//             <Col span={12}>
//               <Form.Item name="isBudgetCenterOnSite" valuePropName="checked">
//                 <Checkbox>Budget Center On Site/งบประมาณกลางสาขา</Checkbox>
//               </Form.Item>
//             </Col>
//             <Col span={12} style={{ textAlign: 'right' }}>
//               <Button type="primary" htmlType="submit" icon={<SearchOutlined />}>
//                 ค้นหางบประมาณ
//               </Button>
//             </Col>
//           </Row>
//         </Form>
//         <Table
//           loading={isFetching}
//           columns={columns}
//           dataSource={data}
//           // pagination={false}
//           pagination={{ position: ['bottomCenter'] }} // FIXME: Implement pagination
//           size="small"
//           scroll={{ x: true }}
//           rowKey="id"
//         />
//         {/* <Pagination
//         // showSizeChanger
//         // showQuickJumper
//         align="center"
//         total={50}
//         style={{ marginTop: 16, textAlign: 'right' }}
//       /> */}
//       </div>
//     </Modal>
//   )
// }

// export default BudgetEnquiryModal
