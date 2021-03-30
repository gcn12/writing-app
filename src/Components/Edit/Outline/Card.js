import styled from 'styled-components'

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
                        <Icon onClick={()=>editCard(props.title, props.text)} onKeyDown={(e)=>keyBoardEdit(e, props.title, props.text)} type='image' alt='edit' src="data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSIyNCIgaGVpZ2h0PSIyNCIgdmlld0JveD0iMCAwIDI0IDI0Ij48cGF0aCBkPSJNMTguMzYzIDguNDY0bDEuNDMzIDEuNDMxLTEyLjY3IDEyLjY2OS03LjEyNSAxLjQzNiAxLjQzOS03LjEyNyAxMi42NjUtMTIuNjY4IDEuNDMxIDEuNDMxLTEyLjI1NSAxMi4yMjQtLjcyNiAzLjU4NCAzLjU4NC0uNzIzIDEyLjIyNC0xMi4yNTd6bS0uMDU2LTguNDY0bC0yLjgxNSAyLjgxNyA1LjY5MSA1LjY5MiAyLjgxNy0yLjgyMS01LjY5My01LjY4OHptLTEyLjMxOCAxOC43MThsMTEuMzEzLTExLjMxNi0uNzA1LS43MDctMTEuMzEzIDExLjMxNC43MDUuNzA5eiIvPjwvc3ZnPg==" />
                        <Icon onClick={deleteCard} onKeyDown={(e)=>keyBoardDelete(e)} type='image' alt='delete' src="data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMjQiIGhlaWdodD0iMjQiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyIgZmlsbC1ydWxlPSJldmVub2RkIiBjbGlwLXJ1bGU9ImV2ZW5vZGQiPjxwYXRoIGQ9Ik0xMiAxMS4yOTNsMTAuMjkzLTEwLjI5My43MDcuNzA3LTEwLjI5MyAxMC4yOTMgMTAuMjkzIDEwLjI5My0uNzA3LjcwNy0xMC4yOTMtMTAuMjkzLTEwLjI5MyAxMC4yOTMtLjcwNy0uNzA3IDEwLjI5My0xMC4yOTMtMTAuMjkzLTEwLjI5My43MDctLjcwNyAxMC4yOTMgMTAuMjkzeiIvPjwvc3ZnPg==" />
                    </Icons>
                    <CardNumber>{props.index + 1}</CardNumber>
                </IconContainer>
            </IconTitleContainer>
            <div></div>
            <Text>{props.text}</Text>
        </Container>
    )
}

export default Card

const CardNumber = styled.p`
    position: relative;
    top: 3px;
    margin-left: 8px;
    color: hsl(0, 0%, 40%);
    &::after {
        content: '.'
    }
`

const Icons = styled.div`
    opacity: 0;
    transition: opacity 300ms ease-in-out;
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

const Icon = styled.input`
    transform: scale(.8);
    margin-left: 8px;
`

const Title = styled.h1`
    font-size: 1rem;
    color: hsl(0, 0%, 40%);
    margin-bottom: 20px;
`

const Text = styled.h2`
    font-size: 1.25rem;
    line-height: 1.5;
`

const Container = styled.div`
    font-size: 1.3rem; 
    background-color: hsl(0, 0%, 95%); 
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