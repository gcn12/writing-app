import styled from 'styled-components'

const ColorThemeCard = (props) => {
    return(
        <Option isSelected={props.theme.colors.name}>
            <SelectOption onClick={()=>props.selectTheme(props.theme.colors)}>
                {props.theme.colors.name}
                <Colors>
                    {Object.entries(props.theme.colors).map((color, index)=> {
                        return(
                            color[0] !== 'name' && color[0] !== 'isDefault' &&
                            <Color backgroundColor={color[1]} key={index}></Color>
                        )
                    })}
                </Colors>
            </SelectOption>
            {!props.theme.colors.isDefault &&
                <DeleteOption onClick={()=>props.deleteTheme(props.index)}>X</DeleteOption>
            }
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
    display: flex;
    flex-direction: column;
    gap: 10px;
`

const DeleteOption = styled.button`
`

const Option = styled.article`
    display: flex;
    align-items: flex-start;
    justify-content: space-between;
    background-color: var(--sidebar);
    padding: 15px;
    min-width: 200px;
    min-height: 50px;
    outline: ${props=>props.isSelected===null ? 'transparent' : '1px solid white'}
`