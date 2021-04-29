import styled from 'styled-components'
import IconComponent from '../../../../Icons/IconComponent'

const ModifierIcon = (props) => {
    return(
        <IconBackgroundContainer aria-label={props.ariaLabel} onClick={(e)=>props.openModal(e)} label={props.labelName} >
            <IconTitle>{props.title}</IconTitle>
            <IconBackground />
            <Icon><IconComponent>
                {props.children}
            </IconComponent></Icon>
        </IconBackgroundContainer>
    )
}

export default ModifierIcon

const IconTitle = styled.div`
    opacity: 0;
    transition: opacity 200ms ease-in-out;
    background-color: var(--primary-text);
    min-height: 20px;
    min-width: 50px;
    position: absolute;
    top: 165%;
    left: 50%;
    transform: translate(-50%, -50%); 
    border-radius: 5px;
    color: var(--sidebar);
    vertical-align: middle;
    padding: 10px;
`

const IconBackground = styled.div`
    opacity: 0;
    transition: opacity 200ms ease-in-out;
    height: 35px;
    width: 35px;
    position: relative;
    border-radius: 50%;
    background-color: var(--sidebar);
    @media(hover: hover) {
        &:hover{
            opacity: 1;
        }
        &:focus{
            opacity: 1;
        }
        &:not(:hover) {
            &:active{
                opacity: 1;
            }
        }
    }
`

const IconBackgroundContainer = styled.button`
    position: relative;
    margin-right: 10px;
    @media(hover: hover) {
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
       
        &:not(:hover) {
            &:active{
                ${IconBackground} {
                opacity: 1;
                }
                ${IconTitle} {
                    opacity: 1;
                }
            }
        }
    }
`

const Icon = styled.div`
    top: 50%;
    left: 50%;
    position: absolute;
    transform: translate(-50%, -50%) scale(.7);
`