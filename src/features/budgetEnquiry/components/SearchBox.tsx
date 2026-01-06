import { SearchOutlined } from '@ant-design/icons'
import { Col, Row, Collapse, Form, FormInstance, Space, Button } from "antd"
import { useEffect, useState } from 'react'
import BudgetYearDropdown from 'components/BudgetYearDropdown'
import SiteWithPermissionDropdown from 'components/SiteWithPermissionDropdown'
import SectionDropdown from 'features/reports/components/SectionDropdown'
import BudgetTypeDropdown from 'components/BudgetTypeDropdown'
import BudgetCodeDropdown from 'components/BudgetCodeDropdown'
import { gutter } from 'constants/index'

type SearchBoxProps = {
    formRef: FormInstance
    activeKey: string[]
    onCollapseChange: (key: string | string[]) => void
    onSearch: () => void
    onReset: () => void
    budgetCode: string | null
    onBudgetCodeChange: (code: string | null) => void
}

const SearchBox = ({ formRef, activeKey, onCollapseChange, onSearch, onReset, onBudgetCodeChange }: SearchBoxProps) => {
    const colSpan = { xs: 24, sm: 24, md: 8, lg: 8, xl: 8 }
    const budgetTypeId = Form.useWatch('budgetTypeId', formRef)
    const [siteCode, setSiteCode] = useState<string | null>(null)

    useEffect(() => {
        formRef.setFieldValue('budgetNo', undefined)
        onBudgetCodeChange(null)
    }, [budgetTypeId, formRef, onBudgetCodeChange])

    const handleSearch = async () => {
        try {
            await formRef.validateFields(['budgetYear', 'siteCode'])
            onSearch()
        } catch (error) {
            console.log('Validation failed:', error)
        }
    }

    return (
        <Collapse
            size="small"
            expandIconPosition="end"
            activeKey={activeKey}
            onChange={onCollapseChange}
            items={[
                {
                    key: '1',
                    label: (
                        <Space>
                            <SearchOutlined />
                            Search/ค้นหา
                        </Space>
                    ),
                    children: (
                        <div>
                            <Form labelWrap form={formRef} layout="vertical">
                                <Row gutter={gutter}>
                                    <Col {...colSpan}>
                                        <Form.Item
                                            label="Budget Year/ปีงบประมาณ"
                                            name="budgetYear"
                                            rules={[{ required: true, message: 'กรุณาเลือกปีงบประมาณ' }]}
                                        >
                                            <BudgetYearDropdown allowClear />
                                        </Form.Item>
                                    </Col>

                                    <Col {...colSpan}>
                                        <Form.Item
                                            label="Site/โรงงาน"
                                            name="siteCode"
                                            rules={[{ required: true, message: 'กรุณาเลือกโรงงาน' }]}
                                        >
                                            <SiteWithPermissionDropdown
                                                allowClear
                                                onChange={() => {
                                                    setSiteCode(formRef.getFieldValue('siteCode'))
                                                }} />
                                        </Form.Item>
                                    </Col>

                                    <Col {...colSpan}>
                                        <Form.Item label="Section/แผนก" name="sectionId">
                                            <SectionDropdown
                                                siteCode={siteCode}
                                                formName='sectionId' />
                                        </Form.Item>
                                    </Col>

                                    <Col {...colSpan}>
                                        <Form.Item label="Budget Type/ชนิดงบประมาณ" name="budgetTypeId">
                                            <BudgetTypeDropdown allowClear />
                                        </Form.Item>
                                    </Col>

                                    <Col {...colSpan}>
                                        <Form.Item
                                            label="Budget Code/งบประมาณเลขที่"
                                            name="budgetNo"
                                            getValueFromEvent={(value, option: any) => {
                                                onBudgetCodeChange(option?.budgetCode || null)
                                                return value
                                            }}
                                        >
                                            <BudgetCodeDropdown
                                                allowClear
                                                disabled={!budgetTypeId}
                                                budgetTypeId={budgetTypeId?.value}
                                            />
                                        </Form.Item>
                                    </Col>

                                </Row>
                                <Row justify="end" style={{ marginTop: 6 }}>
                                    <Space>
                                        <Button onClick={onReset}>Reset</Button>
                                        <Button type="primary" onClick={handleSearch}>Search</Button>
                                    </Space>
                                </Row>
                            </Form>
                        </div>
                    ),
                },
            ]}
        />
    )
}

export default SearchBox