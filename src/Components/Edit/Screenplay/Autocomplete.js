import {
    AutocompleteBackground,
    AutocompleteContainer,
    AutocompleteItem,
} from './EditorAssets'

const Autocomplete = (props) => {
    return(
        <AutocompleteContainer >
            <AutocompleteBackground position={props.position}>
                {props.items.map((item, index)=> {
                    return <AutocompleteItem isSelected={index===props.index} key={item}>{item}</AutocompleteItem>
                })}
            </AutocompleteBackground>
        </AutocompleteContainer>
    )
}

export default Autocomplete