import { Card } from 'antd'

import css from './ContentCard.module.css'

import HeaderTitle from 'components/HeaderTitle'

const ContentCard = ({
  title,
  titlePreIcon,
  titlePostIcon,
  extra,
  style,
  isLoading = false,
  children,
}: {
  title?: string
  children: JSX.Element
  isLoading?: boolean
  titlePreIcon?: JSX.Element
  titlePostIcon?: JSX.Element
  extra?: JSX.Element
  style?: React.CSSProperties
}) => {
  return (
    <Card
      loading={isLoading}
      title={
        title ? (
          <HeaderTitle title={title} titlePreIcon={titlePreIcon} titlePostIcon={titlePostIcon} />
        ) : null
      }
      extra={extra}
      style={style}
      className={css['card-box']}
    >
      {children}
    </Card>
  )
}

export default ContentCard
