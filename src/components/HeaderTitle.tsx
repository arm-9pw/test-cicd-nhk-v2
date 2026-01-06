import styled from 'styled-components'

const PreIcon = styled.span`
  display: inline-block;
  margin-right: 8px;
  color: var(--clr-primary);
`
const PostIcon = styled.span`
  display: inline-block;
  margin-left: 8px;
  color: var(--clr-primary);
`

const Title = styled.span`
  display: inline-block;
  font-size: 18px;
  font-weight: bold;
  color: var(--clr-black);
`

type HeaderTitleProps = {
  title: string
  titlePreIcon?: JSX.Element
  titlePostIcon?: JSX.Element
  extra?: JSX.Element
  style?: React.CSSProperties
  isLoading?: boolean
  children?: JSX.Element
}

const HeaderTitle: React.FC<HeaderTitleProps> = ({ title, titlePreIcon, titlePostIcon }) => {
  return (
    <span>
      {titlePreIcon ? <PreIcon>{titlePreIcon}</PreIcon> : null}
      <Title>{title}</Title>
      {titlePostIcon ? <PostIcon>{titlePostIcon}</PostIcon> : null}
    </span>
  )
}

export default HeaderTitle
