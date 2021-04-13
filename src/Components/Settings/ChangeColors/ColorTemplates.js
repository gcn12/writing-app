import { connect } from 'react-redux'
import { colorThemes } from '../../../redux/actions/appActions'
import { db } from '../../../firebase'
import styled from 'styled-components'

const ColorTemplates = (props) => {

    const updateColorPickers = (colorsArray) => {
        colorsArray.forEach(color=> {
            if(color[0] === 'name') return
            if(color[0] === 'isDefault') return
            document.getElementById(color[0]).value = color[1]
        })
    }

    const selectTheme = (themeColors) => {
        updateColorPickers(Object.entries(themeColors))
        props.dispatch(colorThemes(themeColors))
        db.collection('users')
        .doc(props.userData.userID)
        .update({
            'preferences.colors': themeColors,
        })
        .catch(err=>console.log(err))
    }

    return(
        <div>
            Color Themes:
            <Container>
            {props.themes.map((theme, index)=> {
                return(
                    <Option isSelected={theme.colors.name} key={index}>
                        <SelectOption onClick={()=>selectTheme(theme.colors)}>
                        {theme.colors.name}
                        </SelectOption>
                        {theme.colors.isDefault===false &&
                            <DeleteOption>X</DeleteOption>
                        }
                    </Option>
                )
            })}
            </Container>
        </div>
    )
}

const mapStateToProps = state => ({
    userData: state.app.userData,
    colorThemes: state.app.colorThemes,
})

export default connect(mapStateToProps)(ColorTemplates)

const Option = styled.article`
    background-color: gray;
    padding: 10px;
    margin: 5px 5px 5px 0px;
    width: 200px;
    height: 50px;
    outline: ${props=>props.isSelected===null ? 'transparent' : '1px solid white'}
`

const Container = styled.div`
    display: flex;
    flex-direction: row;
    flex-wrap: wrap;
`

const SelectOption = styled.button`

`

const DeleteOption = styled.button`

`