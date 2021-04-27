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
    position: relative;
`

export const SceneHeadingStyles = styled.p`
    font-weight: 600;
    text-transform: uppercase;
    font-family: 'Courier New', Courier, monospace;
    margin-left: 1px;
    transform: translate(-1px);
    position: relative;
`

export const ParagraphStyles = styled.p`
    font-family: 'Courier New', Courier, monospace;
    font-size: 1rem;
    max-width: 63ch;
    margin-left: 1px;
    transform: translate(-1px);
    position: relative;
`

export const CenteredItemsContainer = styled.div`
    display: flex;
    justify-content: center;
    margin-left: 1px;
    transform: translate(-1px);
    position: relative;
`

export const CharacterStyles = styled.p`
    font-family: 'Courier New', Courier, monospace;
    text-transform: uppercase;
    margin-left: 1px;
    transform: translate(-1px);
    position: relative;
`

export const ParentheticalStyles = styled.p`
    font-family: 'Courier New', Courier, monospace;
    width: 26ch;
    @media(max-width: 700px) {
        width: 17ch;
    }
    @media(max-width: 700px) {
        width: 14ch;
    }
    margin-left: 1px;
    transform: translate(-1px);
    position: relative;
`

export const DialogStyles = styled.div`
    font-family: 'Courier New', Courier, monospace;
    width: 34ch;
    @media(max-width: 700px) {
        width: 25ch;
    }
    @media(max-width: 500px) {
        width: 20ch;
    }
    margin-left: 1px;
    transform: translate(-1px);
    position: relative;
`

export const Container = styled.div`
    font-family: 'Courier New', Courier, monospace;
    width: 65vw;
    max-width: 780px;
    background-color: var(--sidebar);
    padding: 80px 75px 50px 75px;
    border-radius: 5px;
    min-height: 100vh;
    margin: 45px 0;
    @media(max-width: 900px) {
        width: 95vw;
        padding: 80px 35px 50px 35px;
    }
`

export const Decorations = styled.span`
    font-style: ${props=>props.italics};
    font-weight: ${props=>props.weight};
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