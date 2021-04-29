import styled from 'styled-components'
import IconComponent from '../../../Icons/IconComponent'
import CardIcons from './CardIcons'

const Card = (props) => {

    const editCard = () => {
        props.setTitle(props.title)
        props.setText(props.text)
        props.setShowEditModal(true)
        props.setCardIndex(props.index)
    }

    const deleteCard = () => {
        props.setShowDeleteModal(true)
        props.setCardIndex(props.index)
    }

    const keyBoardDelete = (e) => {
        if(e.key==='Enter'||e.key==='Space')  {
            deleteCard()
            e.stopPropagation()
            e.nativeEvent.stopImmediatePropagation()
            e.preventDefault()
        }
    }

    const keyBoardEdit = (e) => {
        if(e.key==='Enter'||e.key==='Space')  {
            editCard(props.title, props.text)
            e.stopPropagation()
            e.nativeEvent.stopImmediatePropagation()
            e.preventDefault()
        }
    }

    return(
        <Container {...props} ref={props.innerRef}>
            <MainContentContainer>
                <IconTitleContainer>
                    <Title>{props.title}</Title>
                    <IconContainer>
                        <Icons>
                            <CardIcons idValue={`card-edit-button-${props.index}`} name='Rename' ariaLabel='rename card' index={props.index}  click={editCard} keyDown={keyBoardEdit}>
                                <path d="M18.363 8.464l1.433 1.431-12.67 12.669-7.125 1.436 1.439-7.127 12.665-12.668 1.431 1.431-12.255 12.224-.726 3.584 3.584-.723 12.224-12.257zm-.056-8.464l-2.815 2.817 5.691 5.692 2.817-2.821-5.693-5.688zm-12.318 18.718l11.313-11.316-.705-.707-11.313 11.314.705.709z"/>
                            </CardIcons>
                            <CardIcons idValue={`card-delete-button-${props.index}`} name='Delete' ariaLabel='delete card' index={props.index} click={deleteCard} keyDown={keyBoardDelete}>
                                <path d="M9 19c0 .552-.448 1-1 1s-1-.448-1-1v-10c0-.552.448-1 1-1s1 .448 1 1v10zm4 0c0 .552-.448 1-1 1s-1-.448-1-1v-10c0-.552.448-1 1-1s1 .448 1 1v10zm4 0c0 .552-.448 1-1 1s-1-.448-1-1v-10c0-.552.448-1 1-1s1 .448 1 1v10zm5-17v2h-20v-2h5.711c.9 0 1.631-1.099 1.631-2h5.315c0 .901.73 2 1.631 2h5.712zm-3 4v16h-14v-16h-2v18h18v-18h-2z"/>
                            </CardIcons>
                        </Icons>
                        <DragIconContainerDesktop>
                            <IconComponent>
                                <path d="M24 12l-6-5v4h-5v-5h4l-5-6-5 6h4v5h-5v-4l-6 5 6 5v-4h5v5h-4l5 6 5-6h-4v-5h5v4z"/>
                            </IconComponent>
                        </DragIconContainerDesktop>    
                        <CardNumber aria-label={`card ${props.index + 1}`}>{props.index + 1}</CardNumber>
                    </IconContainer>
                </IconTitleContainer>
                <Text>{props.text}</Text>
            </MainContentContainer>
            <IconsMobile>
                <CardIcons idValue={`card-edit-button-${props.index}`} name='Rename' ariaLabel='rename card' index={props.index}  click={editCard} keyDown={keyBoardEdit}>
                    <path d="M18.363 8.464l1.433 1.431-12.67 12.669-7.125 1.436 1.439-7.127 12.665-12.668 1.431 1.431-12.255 12.224-.726 3.584 3.584-.723 12.224-12.257zm-.056-8.464l-2.815 2.817 5.691 5.692 2.817-2.821-5.693-5.688zm-12.318 18.718l11.313-11.316-.705-.707-11.313 11.314.705.709z"/>
                </CardIcons>
                <CardIcons idValue={`card-delete-button-${props.index}`} name='Delete' ariaLabel='delete card' index={props.index} click={deleteCard} keyDown={keyBoardDelete}>
                    <path d="M9 19c0 .552-.448 1-1 1s-1-.448-1-1v-10c0-.552.448-1 1-1s1 .448 1 1v10zm4 0c0 .552-.448 1-1 1s-1-.448-1-1v-10c0-.552.448-1 1-1s1 .448 1 1v10zm4 0c0 .552-.448 1-1 1s-1-.448-1-1v-10c0-.552.448-1 1-1s1 .448 1 1v10zm5-17v2h-20v-2h5.711c.9 0 1.631-1.099 1.631-2h5.315c0 .901.73 2 1.631 2h5.712zm-3 4v16h-14v-16h-2v18h18v-18h-2z"/>
                </CardIcons>
                <DragIconContainerMobile>
                    <IconComponent>
                        <path d="M24 12l-6-5v4h-5v-5h4l-5-6-5 6h4v5h-5v-4l-6 5 6 5v-4h5v5h-4l5 6 5-6h-4v-5h5v4z"/>
                    </IconComponent>
                </DragIconContainerMobile>  
            </IconsMobile>
        </Container>
    )
}

export default Card

const MainContentContainer = styled.div`
    display: flex;
    flex-direction: column;
`

const DragIconContainer = styled.div`
    transform: scale(.8);
    opacity: .8;
    touch-action: none; 
    align-self: flex-end;
    position: relative;
    @media(min-width: 700px) {
        top: -5px;
    }
    @media(hover: hover) {
        &:not(:hover) {
            display: none;
        }
    }  
`

const DragIconContainerDesktop = styled(DragIconContainer)`
    @media(max-width: 700px) {
        display: none;
    }
`

const DragIconContainerMobile = styled(DragIconContainer)`
    position: relative;
    top: -3px;
    @media(min-width: 700px) {
        display: none;
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

const IconsMobile = styled.div`
    display: flex;
    align-items: center;
    justify-content: flex-end;
    transition: opacity 300ms ease-in-out;
    @media(hover: hover) {
        &:not(:hover) {
            opacity: 0;
        }
    }
    @media(min-width: 700px) {
        display: none;
    }
`

const IconTitleContainer = styled.div`
    display: flex;
    justify-content: space-between;
    align-items: center;
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

const Title = styled.h1`
    font-size: 1rem;
    opacity: .8;
    color: var(--primary-text);
    margin-bottom: 20px;
`

const Text = styled.h2`
    font-size: 1.25rem;
    line-height: 1.5;
`

const Container = styled.article`
    touch-action: manipulation;
    background-color: var(--sidebar);
    padding: 30px;
    display: flex;
    flex-direction: column;
    justify-content: space-between;
    border-radius: 15px;
    width: auto;
    min-height: 200px;
    height: 100%;
    cursor: move;
    &:hover {
        ${Icons} {
            opacity: 1;
        }
    }
`