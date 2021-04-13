import styled from 'styled-components'
import IconComponent from '../../../../Icons/IconComponent'

const ModifierIcon = (props) => {
    return(
        <IconBackgroundContainer onClick={(e)=>props.openModal(e)} label={props.labelName} >
            <IconTitle>{props.title}</IconTitle>
            <Icon><IconComponent>
                {props.children}
            </IconComponent></Icon>
            <IconBackground />
        </IconBackgroundContainer>
    )
}

export default ModifierIcon

const IconTitle = styled.div`
    opacity: 0;
    transition: opacity 200ms ease-in-out;
    background-color: hsl(0, 0%, 10%);
    height: 30px;
    min-width: 50px;
    position: absolute;
    z-index: 10;
    top: 160%;
    left: 50%;
    transform: translate(-50%, -50%); 
    border-radius: 5px;
    color: white;
    vertical-align: middle;
    padding: 5px 10px;
`

const IconBackground = styled.div`
    opacity: 0;
    transition: opacity 200ms ease-in-out;
    background-color: var(--sidebar);
    height: 35px;
    width: 35px;
    position: relative;
    border-radius: 50%;
    &:hover{
        opacity: 1;
    }
    &:focus{
        opacity: 1;
    }
`

const IconBackgroundContainer = styled.button`
    position: relative;
    margin-right: 10px;
    &:hover{
        ${IconBackground} {
            opacity: 1;
        }
        ${IconTitle} {
            opacity: 1;
        }
    }
    &:focus{
        ${IconBackground} {
            opacity: 1;
        }
        ${IconTitle} {
            opacity: 1;
        }
    }
`

const Icon = styled.div` 
    /* width: 18px;
    height: 18px; */
    z-index: 100;
    top: 50%;
    left: 50%;
    position: absolute;
    transform: translate(-50%, -50%) scale(.7);
`