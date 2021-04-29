import styled from 'styled-components'

const ColorThemeCard = (props) => {
    return(
        <Option isSelected={props.theme.colors.name}>
            <SelectOption onClick={()=>props.selectTheme(props.theme.colors)}>
                <Name>{props.theme.colors.name}</Name>
                <Colors>
                    <Color backgroundColor={props.theme.colors.background} />
                    <Color backgroundColor={props.theme.colors.primaryText} />
                    <Color backgroundColor={props.theme.colors.sidebar} />
                    <Color backgroundColor={props.theme.colors.highlight} />
                    <Color backgroundColor={props.theme.colors.secondary} />
                </Colors>
            </SelectOption>
            {!props.theme.colors.isDefault &&
                <DeleteOption aria-label='delete theme' onClick={()=>props.deleteTheme(props.index)}>X</DeleteOption>
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
    /* border: 1px solid var(--sidebar); */
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
    width: 100%;
    height: 100%;
`

const DeleteOption = styled.button`
    margin-left: 20px;
    /* color: var(--sidebar); */
`

const Name = styled.p`
    text-align: left;
    /* color: var(--sidebar); */
`

const Option = styled.article`
    display: flex;
    align-items: flex-start;
    justify-content: space-between;
    background-color: var(--sidebar);
    /* background-color: var(--primary-text); */
    padding: 20px;
    border-radius: 5px;
    max-width: 300px;
    width: 100%;
    min-height: 50px;
    /* margin: 0 10px 10px 0; */
    /* border: ${props=>props.isSelected===null ? 'transparent' : '1px solid white'}; */
    @media(max-width: 500px) {
        min-height: 80px;
    } 
`