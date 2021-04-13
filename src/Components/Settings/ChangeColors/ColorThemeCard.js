import styled from 'styled-components'

const ColorThemeCard = (props) => {
    return(
        <Option isSelected={props.theme.colors.name}>
            <SelectOption onClick={()=>props.selectTheme(props.theme.colors)}>
                {props.theme.colors.name}
            </SelectOption>
            {props.theme.colors.isDefault===false &&
                <DeleteOption>X</DeleteOption>
            }
            <Colors>
                {Object.entries(props.theme.colors).map((color, index)=> {
                    return(
                        color[0] !== 'name' && color[0] !== 'isDefault' &&
                        <Color backgroundColor={color[1]} key={index}></Color>
                    )
                })}
            </Colors>
        </Option>
    )
}

export default ColorThemeCard

const Color = styled.div`
    background-color: ${props=>props.backgroundColor};
    height: 15px;
    width: 15px;
    border: 1px solid var(--primary-text);
`

const Colors = styled.div`
    display: flex;
    gap: 5px;
`

const SelectOption = styled.button`

`

const DeleteOption = styled.button`

`

const Option = styled.article`
    background-color: var(--sidebar);
    padding: 10px;
    margin: 5px 5px 5px 0px;
    width: 200px;
    height: 50px;
    outline: ${props=>props.isSelected===null ? 'transparent' : '1px solid white'}
`