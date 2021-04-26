import styled from 'styled-components'
import IconComponent from '../../../Icons/IconComponent'

const Card = (props) => {

    const editCard = (title, text) => {
        props.setTitle(title)
        props.setText(text)
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

    const keyBoardEdit = (e, title, text) => {
        if(e.key==='Enter'||e.key==='Space')  {
            editCard(title, text)
            e.stopPropagation()
            e.nativeEvent.stopImmediatePropagation()
            e.preventDefault()
        }
    }

    return(
        <Container {...props} ref={props.innerRef}>
            <IconTitleContainer>
                <Title>{props.title}</Title>
                <IconContainer>
                    <Icons>
                        <IconBackgroundContainer aria-label='rename card' id={`card-edit-button-${props.index}`} role='button' onClick={()=>editCard(props.title, props.text)} onKeyDown={(e)=>keyBoardEdit(e, props.title, props.text)}>
                            <IconTitle>Rename</IconTitle>
                            <IconBackground />
                            <Icon>
                                <IconComponent>
                                    <path d="M18.363 8.464l1.433 1.431-12.67 12.669-7.125 1.436 1.439-7.127 12.665-12.668 1.431 1.431-12.255 12.224-.726 3.584 3.584-.723 12.224-12.257zm-.056-8.464l-2.815 2.817 5.691 5.692 2.817-2.821-5.693-5.688zm-12.318 18.718l11.313-11.316-.705-.707-11.313 11.314.705.709z"/>
                                </IconComponent>
                            </Icon>
                            {/* <Icon alt='edit' src="data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSIyNCIgaGVpZ2h0PSIyNCIgdmlld0JveD0iMCAwIDI0IDI0Ij48cGF0aCBkPSJNMTguMzYzIDguNDY0bDEuNDMzIDEuNDMxLTEyLjY3IDEyLjY2OS03LjEyNSAxLjQzNiAxLjQzOS03LjEyNyAxMi42NjUtMTIuNjY4IDEuNDMxIDEuNDMxLTEyLjI1NSAxMi4yMjQtLjcyNiAzLjU4NCAzLjU4NC0uNzIzIDEyLjIyNC0xMi4yNTd6bS0uMDU2LTguNDY0bC0yLjgxNSAyLjgxNyA1LjY5MSA1LjY5MiAyLjgxNy0yLjgyMS01LjY5My01LjY4OHptLTEyLjMxOCAxOC43MThsMTEuMzEzLTExLjMxNi0uNzA1LS43MDctMTEuMzEzIDExLjMxNC43MDUuNzA5eiIvPjwvc3ZnPg==" /> */}
                        </IconBackgroundContainer>
                        
                        <IconBackgroundContainer aria-label='delete card' id={`card-delete-button-${props.index}`} role='button' onClick={deleteCard} onKeyDown={(e)=>keyBoardDelete(e)}>
                            <IconTitle>Delete</IconTitle>
                            <IconBackground />
                            <Icon>
                                <IconComponent>
                                    <path d="M9 19c0 .552-.448 1-1 1s-1-.448-1-1v-10c0-.552.448-1 1-1s1 .448 1 1v10zm4 0c0 .552-.448 1-1 1s-1-.448-1-1v-10c0-.552.448-1 1-1s1 .448 1 1v10zm4 0c0 .552-.448 1-1 1s-1-.448-1-1v-10c0-.552.448-1 1-1s1 .448 1 1v10zm5-17v2h-20v-2h5.711c.9 0 1.631-1.099 1.631-2h5.315c0 .901.73 2 1.631 2h5.712zm-3 4v16h-14v-16h-2v18h18v-18h-2z"/>
                                </IconComponent>
                            </Icon>
                            {/* <Icon alt='delete' src="data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMjQiIGhlaWdodD0iMjQiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyIgZmlsbC1ydWxlPSJldmVub2RkIiBjbGlwLXJ1bGU9ImV2ZW5vZGQiPjxwYXRoIGQ9Ik0xMiAxMS4yOTNsMTAuMjkzLTEwLjI5My43MDcuNzA3LTEwLjI5MyAxMC4yOTMgMTAuMjkzIDEwLjI5My0uNzA3LjcwNy0xMC4yOTMtMTAuMjkzLTEwLjI5MyAxMC4yOTMtLjcwNy0uNzA3IDEwLjI5My0xMC4yOTMtMTAuMjkzLTEwLjI5My43MDctLjcwNyAxMC4yOTMgMTAuMjkzeiIvPjwvc3ZnPg==" /> */}
                        </IconBackgroundContainer>
                    </Icons>
                    <CardNumber aria-label={`card ${props.index + 1}`}>{props.index + 1}</CardNumber>
                </IconContainer>
            </IconTitleContainer>
            <div></div>
            <Text>{props.text}</Text>
        </Container>
    )
}

export default Card

const IconTitle = styled.div`
    transition: opacity 200ms ease-in-out;
    opacity: 0;
    background-color: var(--primary-text);
    height: auto;
    min-width: 50px;
    position: absolute;
    /* z-index: 5; */
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

const CardNumber = styled.p`
    position: relative;
    top: 3px;
    margin-left: 8px;
    /* color: hsl(0, 0%, 40%); */
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
        }
    }
`

const IconTitleContainer = styled.div`
    display: flex;
    justify-content: space-between;
    align-items: center;
`

const IconContainer = styled.div`
    display: flex;
    justify-content: flex-end;
    position: relative;
    top: -10px;
    &:focus-within {
        ${Icons} {
            opacity: 1;
        }
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
    top: 50%;
    left: 50%;
    position: absolute;
`

const Title = styled.h1`
    font-size: 1rem;
    color: var(--primary-text);
    margin-bottom: 20px;
`

const Text = styled.h2`
    font-size: 1.25rem;
    line-height: 1.5;
`

const Container = styled.article`
    touch-action: none;
    font-size: 1.3rem; 
    background-color: var(--sidebar);
    padding: 30px;
    display: flex;
    border-radius: 15px;
    flex-direction: column;
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