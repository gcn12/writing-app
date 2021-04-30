import styled from 'styled-components'
import CardIcons from './CardIcons'

const DesktopIcons = (props) => {
    return(
        <IconContainer>
            <Icons>
                <CardIcons idValue={`card-edit-button-${props.index}`} name='Rename' ariaLabel='rename card' index={props.index}  click={props.editCard} keyDown={props.keyBoardEdit}>
                    <path d="M18.363 8.464l1.433 1.431-12.67 12.669-7.125 1.436 1.439-7.127 12.665-12.668 1.431 1.431-12.255 12.224-.726 3.584 3.584-.723 12.224-12.257zm-.056-8.464l-2.815 2.817 5.691 5.692 2.817-2.821-5.693-5.688zm-12.318 18.718l11.313-11.316-.705-.707-11.313 11.314.705.709z"/>
                </CardIcons>
                <CardIcons idValue={`card-delete-button-${props.index}`} name='Delete' ariaLabel='delete card' index={props.index} click={props.deleteCard} keyDown={props.keyBoardDelete}>
                    <path d="M9 19c0 .552-.448 1-1 1s-1-.448-1-1v-10c0-.552.448-1 1-1s1 .448 1 1v10zm4 0c0 .552-.448 1-1 1s-1-.448-1-1v-10c0-.552.448-1 1-1s1 .448 1 1v10zm4 0c0 .552-.448 1-1 1s-1-.448-1-1v-10c0-.552.448-1 1-1s1 .448 1 1v10zm5-17v2h-20v-2h5.711c.9 0 1.631-1.099 1.631-2h5.315c0 .901.73 2 1.631 2h5.712zm-3 4v16h-14v-16h-2v18h18v-18h-2z"/>
                </CardIcons>
            </Icons>   
            <CardNumber aria-label={`card ${props.index + 1}`}>{props.index + 1}</CardNumber>
        </IconContainer>
    )
}

export default DesktopIcons

const Icons = styled.div`
    transition: opacity 300ms ease-in-out;
    @media(hover: hover) {
        &:not(:hover) {
            opacity: 0;
            @media(max-width: 700px) {
                display: none;
            }
        }
    }
`

const IconContainer = styled.div`
    position: relative;
    top: -10px;
    display: flex;
    align-items: center;
    &:focus-within {
        ${Icons} {
            opacity: 1;
        }
    }
`

const CardNumber = styled.p`
    font-size: 1rem;
    margin-left: 8px;
    opacity: .8;
    color: var(--primary-text);
    &::after {
        content: '.'
    }
`