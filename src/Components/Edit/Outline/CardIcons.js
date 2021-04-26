import styled from 'styled-components'
import IconComponent from '../../../Icons/IconComponent'

const CardIcons = (props) => {
    return(
        <IconBackgroundContainer aria-label={props.ariaLabel} id={props.idValue} role='button' onClick={props.click} onKeyDown={props.keyDown}>
            <IconTitle>{props.name}</IconTitle>
            <IconBackground />
            <Icon>
                <IconComponent>
                    {props.children}
                </IconComponent>
            </Icon>
        </IconBackgroundContainer>
    )
}

export default CardIcons

const IconTitle = styled.div`
    transition: opacity 200ms ease-in-out;
    opacity: 0;
    background-color: var(--primary-text);
    height: auto;
    min-width: 50px;
    position: absolute;
    top: 160%;
    left: 50%;
    transform: translate(-50%, -50%); 
    border-radius: 5px;
    color: var(--sidebar);
    vertical-align: middle;
    padding: 10px 10px;
    font-size: 1rem;
`

const IconBackground = styled.div`
    opacity: 0;
    transition: opacity 200ms ease-in-out;
    background-color: var(--background);
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
    transform: translate(-50%, -50%) scale(.7);
    /* z-index: 10; */
    opacity: .8;
    top: 50%;
    left: 50%;
    position: absolute;
`