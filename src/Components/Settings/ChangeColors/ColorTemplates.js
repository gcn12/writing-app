import { connect } from 'react-redux'
import { colorThemes } from '../../../redux/actions/appActions'
import { db } from '../../../firebase'
import ColorThemeCard from './ColorThemeCard'
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
            <Title>Color Themes:</Title>
            <Container>
            {props.themes.map((theme, index)=> {
                return(
                    <ColorThemeCard index={index} deleteTheme={props.deleteTheme} selectTheme={selectTheme} theme={theme} key={index} />
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

const Title = styled.h2`
    font-size: 1.125rem;
    margin-bottom: 10px;
    font-weight: 600;
`

const Container = styled.div`
    display: flex;
    flex-direction: row;
    flex-wrap: wrap;
    gap: 10px;
`