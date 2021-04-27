import styled from 'styled-components'

const Autocomplete = (props) => {
    return(
        <AutocompleteContainer>
            <AutocompleteBackground position={props.position}>
                {props.items.map((item, index)=> {
                    return <AutocompleteItem isSelected={index===props.index} key={item}>{item}</AutocompleteItem>
                })}
            </AutocompleteBackground>
        </AutocompleteContainer>
    )
}

export default Autocomplete

const AutocompleteContainer = styled.div`
    font-family: 'Courier New', Courier, monospace;
`

const AutocompleteBackground = styled.div`
    position: absolute;
    top: ${props=>props.position.top};
    left: ${props=>props.position.left};
    display: ${props=>props.position.display};
    flex-direction: column;
    font-family: 'Courier New', Courier, monospace;
    background-color: white;
    border-radius: 5px;
    box-shadow: 2px 4px 6px rgba(0, 0, 0, .2);
`

const AutocompleteItem = styled.span`
    padding: 8px;
    font-family: 'Courier New', Courier, monospace;
    font-weight: 600;
    color: black;
    background-color: ${props=>props.isSelected ? 'hsl(217, 49%, 94%)' : 'transparent'};
    &:first-of-type {
        border-radius: 5px 5px 0 0;
    }
    &:last-of-type {
        border-radius: 0 0 5px 5px;
    }
`