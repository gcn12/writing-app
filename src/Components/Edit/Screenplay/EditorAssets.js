import styled from 'styled-components'

//components 

export const Dialog = (props) => {
    return (
        <CenteredItemsContainer>
            <DialogStyles {...props.attributes}>{props.children}</DialogStyles>
        </CenteredItemsContainer>
    )
}

export const Character = (props) => {
    return (
        <CenteredItemsContainer>
            <CharacterStyles {...props.attributes}>{props.children}</CharacterStyles>
        </CenteredItemsContainer>
    )
}

export const SceneHeading = (props) => {
    return <SceneHeadingStyles {...props.attributes}>{props.children}</SceneHeadingStyles>
}

export const Paragraph = (props) => {
    return <ParagraphStyles {...props.attributes}>{props.children}</ParagraphStyles>
}

export const Transition = (props) => {
    return <TransitionStyles {...props.attributes}>{props.children}</TransitionStyles>
}

export const Parenthetical = (props) => {
    return (
        <CenteredItemsContainer>
            <ParentheticalStyles {...props.attributes}>{props.children}</ParentheticalStyles>
        </CenteredItemsContainer>
    )
}

//styles 

export const TransitionStyles = styled.p`
    font-weight: 500;
    display: flex;
    justify-content: flex-end;
    font-family: 'Courier New', Courier, monospace;
    text-transform: uppercase;
    margin-left: 1px;
    transform: translate(-1px);
    /* color: black; */
`

export const SceneHeadingStyles = styled.p`
    font-weight: 600;
    text-transform: uppercase;
    font-family: 'Courier New', Courier, monospace;
    /* color: black; */
`

export const ParagraphStyles = styled.p`
    font-family: 'Courier New', Courier, monospace;
    font-size: 1rem;
    max-width: 63ch;
    /* color: black; */
`

export const CenteredItemsContainer = styled.div`
    display: flex;
    justify-content: center;
    margin-left: 1px;
    transform: translate(-1px);
`

export const CharacterStyles = styled.p`
    font-family: 'Courier New', Courier, monospace;
    text-transform: uppercase;
    /* color: black; */
`

export const ParentheticalStyles = styled.p`
    font-family: 'Courier New', Courier, monospace;
    width: 26ch;
    /* color: black; */
`

export const DialogStyles = styled.div`
    font-family: 'Courier New', Courier, monospace;
    width: 34ch;
    /* color: ; */
`

export const Container = styled.div`
    font-family: 'Courier New', Courier, monospace;
    width: 65vw;
    max-width: 780px;
    background-color: var(--sidebar);
    padding: 80px 75px 50px 75px;
    border-radius: 5px;
    min-height: 92vh;
    margin: 45px 0;
    @media(max-width: 900px) {
        width: 95vw;
        padding: 80px 35px 50px 35px;
    }
    /* overflow: scroll;
    height: 90vh; */
`

// dropdown items
export const TIME_OF_DAY = [
    'DAWN',
    'MORNING',
    'DAY',
    'AFTERNOON',
    'DUSK',
    'NIGHT',
    'EVENING',
]