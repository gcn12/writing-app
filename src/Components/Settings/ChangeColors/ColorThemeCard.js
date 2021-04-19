import styled from 'styled-components'

const ColorThemeCard = (props) => {
    return(
        <Option isSelected={props.theme.colors.name}>
            <SelectOption onClick={()=>props.selectTheme(props.theme.colors)}>
                {props.theme.colors.name}
                <Colors>
                    <Color backgroundColor={props.theme.colors.background} />
                    <Color backgroundColor={props.theme.colors.primaryText} />
                    <Color backgroundColor={props.theme.colors.sidebar} />
                    <Color backgroundColor={props.theme.colors.highlight} />
                    <Color backgroundColor={props.theme.colors.secondary} />
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
    margin-right: 5px;
`

const Colors = styled.div`
    display: flex;
    /* gap: 5px; */
    margin-top: 5px;
`

const SelectOption = styled.button`
    display: flex;
    flex-direction: column;
    /* gap: 10px; */
    /* margin: 10px 0; */
`

const DeleteOption = styled.button`
`

const Option = styled.article`
    display: flex;
    align-items: flex-start;
    justify-content: space-between;
    background-color: var(--sidebar);
    padding: 15px;
    max-width: 250px;
    width: 100%;
    min-height: 50px;
    margin: 0 10px 10px 0;
    outline: ${props=>props.isSelected===null ? 'transparent' : '1px solid white'}
`