import styled from 'styled-components'

const IconComponent = (props) => {
    return (
        <Fill fill={props.fill} xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24">{props.children}</Fill>
    )
}

export default IconComponent

const Fill = styled.svg`
    fill: var(--primary-text);
`