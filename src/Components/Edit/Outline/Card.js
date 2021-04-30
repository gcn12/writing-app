import styled from 'styled-components'
import DesktopIcons from './DesktopIcons'
import MobileIcons from './MobileIcons'

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
                    <DesktopIcons editCard={editCard} deleteCard={deleteCard} keyBoardDelete={keyBoardDelete} keyBoardEdit={keyBoardEdit} index={props.index} />
                </IconTitleContainer>
                <Text>{props.text}</Text>
            </MainContentContainer>
            <MobileIcons />
        </Container>
    )
}

export default Card

const MainContentContainer = styled.div`
    display: flex;
    flex-direction: column;
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

const IconTitleContainer = styled.div`
    display: flex;
    justify-content: space-between;
    align-items: center;
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