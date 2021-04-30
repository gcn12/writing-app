import styled from 'styled-components'
import IconComponent from '../../../Icons/IconComponent'

const MobileIcons = (props) => {
    return (
        <IconsMobile>
            <MobileIconContainer aria-label='rename card' id={`card-edit-button-${props.index}`} onClick={props.editCard} >
                <IconComponent>
                    <path d="M18.363 8.464l1.433 1.431-12.67 12.669-7.125 1.436 1.439-7.127 12.665-12.668 1.431 1.431-12.255 12.224-.726 3.584 3.584-.723 12.224-12.257zm-.056-8.464l-2.815 2.817 5.691 5.692 2.817-2.821-5.693-5.688zm-12.318 18.718l11.313-11.316-.705-.707-11.313 11.314.705.709z"/>
                </IconComponent>
            </MobileIconContainer>
            <MobileIconContainer aria-label='delete card' id={`card-delete-button-${props.index}`} onClick={props.deleteCard} >
                <IconComponent>
                    <path d="M9 19c0 .552-.448 1-1 1s-1-.448-1-1v-10c0-.552.448-1 1-1s1 .448 1 1v10zm4 0c0 .552-.448 1-1 1s-1-.448-1-1v-10c0-.552.448-1 1-1s1 .448 1 1v10zm4 0c0 .552-.448 1-1 1s-1-.448-1-1v-10c0-.552.448-1 1-1s1 .448 1 1v10zm5-17v2h-20v-2h5.711c.9 0 1.631-1.099 1.631-2h5.315c0 .901.73 2 1.631 2h5.712zm-3 4v16h-14v-16h-2v18h18v-18h-2z"/>
                </IconComponent>
            </MobileIconContainer>
            <MobileIconMove>
                <IconComponent>
                    <path d="M24 12l-6-5v4h-5v-5h4l-5-6-5 6h4v5h-5v-4l-6 5 6 5v-4h5v5h-4l5 6 5-6h-4v-5h5v4z"/>
                </IconComponent>
            </MobileIconMove>
        </IconsMobile>
    )
}

export default MobileIcons

const MobileIconContainer = styled.button`
    margin-left: 15px;
    margin-top: 20px;
    transform: scale(.75);
    touch-action: none;
    display: initial;
    @media(hover: hover) {
        display: none;
    }
    @media(hover: none) {
        display: initial;
    }
`

const MobileIconMove = styled.div`
    margin-left: 15px;
    margin-top: 20px;
    transform: scale(.75);
    touch-action: none;
    display: initial;
    @media(hover: hover) {
        display: none;
    }
    @media(hover: none) {
        display: initial;
    }
`

const IconsMobile = styled.div`
    align-self: flex-end;
    display: flex;
    opacity: .8;
`