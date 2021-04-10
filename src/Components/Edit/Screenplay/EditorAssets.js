import styled from 'styled-components'

//components 

export const Dialog = (props) => {
    return (
        <DialogContainer>
            <DialogStyles {...props.attributes}>{props.children}</DialogStyles>
        </DialogContainer>
    )
}

export const Character = (props) => {
    return (
        <CharacterContainer>
            <CharacterStyles {...props.attributes}>{props.children}</CharacterStyles>
        </CharacterContainer>
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
    return <ParentheticalStyles {...props.attributes}>{props.children}</ParentheticalStyles>
}

//styles 

export const TransitionStyles = styled.p`
    font-weight: 500;
    display: flex;
    justify-content: flex-end;
    /* color: red; */
    font-family: 'Courier New', Courier, monospace;
    text-transform: uppercase;
`

export const SceneHeadingStyles = styled.p`
    font-weight: 600;
    text-transform: uppercase;
    font-family: 'Courier New', Courier, monospace;
`

export const ParagraphStyles = styled.p`
    /* color: blue; */
    font-family: 'Courier New', Courier, monospace;
    font-size: 1rem;
    max-width: 60ch;
`

export const CharacterStyles = styled.p`
    /* text-align: center; */
    font-family: 'Courier New', Courier, monospace;
    /* color: orange; */
`

const CharacterContainer = styled.div`
    display: flex;
    justify-content: center;
    margin-left: 1px;
    transform: translate(-1px);
`

export const ParentheticalStyles = styled.p`
    display: flex;
    font-family: 'Courier New', Courier, monospace;
    justify-content: center;
    /* color: brown; */
`
export const DialogContainer = styled.div`
    display: flex;
    justify-content: center;
    margin-left: 1px;
    transform: translate(-1px);
    /* text-align: center;
    margin: 0 auto; */
`

export const DialogStyles = styled.div`
    /* text-align: center; */
    font-family: 'Courier New', Courier, monospace;
    /* display: block; */
    /* color: green; */
    width: 34ch;
`

export const Container = styled.div`
    font-family: 'Courier New', Courier, monospace;
    width: 60vw;
    max-width: 600px;
    margin: 0 auto;
`

export const AutocompleteContainer = styled.div`
    font-family: 'Courier New', Courier, monospace;
`

export const AutocompleteBackground = styled.div`
    position: absolute;
    top: ${props=>props.position.top};
    left: ${props=>props.position.left};
    display: ${props=>props.position.display};
    flex-direction: column;
    font-family: 'Courier New', Courier, monospace;
    background-color: white;
    border-radius: 5px;
`

export const AutocompleteItem = styled.span`
    padding: 8px;
    font-family: 'Courier New', Courier, monospace;
    font-weight: 600;
    background-color: ${props=>props.isSelected ? 'hsl(217, 49%, 94%)' : 'transparent'};
    &:first-of-type {
        border-radius: 5px 5px 0 0;
    }
    &:last-of-type {
        border-radius: 0 0 5px 5px;
    }
`

// dropdown items
export const TIME_OF_DAY = [
    'DAWN',
    'MORNING',
    'DAY',
    'AFTERNOON',
    'DUSK',
    'NIGHT',
]

export const LOCATIONS = [
    'HOUSE',
    '123 STREET',
    'OLD RESTAURANT',
    'MODERN MUSEUM',
    'POOL',
    'DISCO CLUB',
    'SHOPPING MALL',
    'FOREST',
]

export const NAMES = [
    'JEFF',
    'CHRIS',
    'DAN',
    'AVERY',
    'FRANCESCA',
    'BRITTANY',
    'BRIANNA',
    'BRIDGET',
    'BETHANY',
]