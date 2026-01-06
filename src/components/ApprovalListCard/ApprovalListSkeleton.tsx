import React from 'react'

import { List, Skeleton } from 'antd'

interface ApprovalListSkeletonProps {
  count?: number
}

const ApprovalListSkeleton: React.FC<ApprovalListSkeletonProps> = ({ count = 3 }) => {
  // Create array of skeleton items
  const skeletonItems = Array.from({ length: count }, (_, index) => ({
    id: `skeleton-${index}`,
  }))

  return (
    <List
      itemLayout="vertical"
      dataSource={skeletonItems}
      renderItem={(item) => (
        <List.Item 
          key={item.id} 
          style={{
            padding: '8px',
            margin: '8px',
            borderRadius: '8px',
            backgroundColor: '#fafafa',
            border: '1px solid #f0f0f0',
          }}
        >
          <List.Item.Meta
            avatar={
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                <Skeleton.Avatar size="large" shape="square" active />
              </div>
            }
            title={
              <div style={{
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
              }}>
                <div>
                  <Skeleton.Input 
                    style={{ width: 200, height: 16 }} 
                    active 
                    size="small" 
                  />
                  <span style={{ margin: '0 8px', color: '#d9d9d9' }}>-</span>
                  <Skeleton.Input 
                    style={{ width: 150, height: 14 }} 
                    active 
                    size="small" 
                  />
                </div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                  <Skeleton.Button 
                    style={{ width: 40, height: 22 }} 
                    active 
                    size="small" 
                  />
                  <Skeleton.Input 
                    style={{ width: 120, height: 12 }} 
                    active 
                    size="small" 
                  />
                </div>
              </div>
            }
            description={
              <div style={{
                display: 'flex',
                flexDirection: 'column',
                gap: '4px',
              }}>
                <Skeleton.Input 
                  style={{ width: '80%', height: 14 }} 
                  active 
                  size="small" 
                />
                <Skeleton.Input 
                  style={{ width: '60%', height: 14 }} 
                  active 
                  size="small" 
                />
                <div style={{
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'center',
                  marginTop: '8px',
                }}>
                  <Skeleton.Input 
                    style={{ width: 100, height: 16 }} 
                    active 
                    size="small" 
                  />
                </div>
              </div>
            }
          />
        </List.Item>
      )}
    />
  )
}

export default ApprovalListSkeleton
