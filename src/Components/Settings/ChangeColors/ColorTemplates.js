import { connect } from 'react-redux'
import { colors } from '../../../redux/actions/appActions'
import { db } from '../../../firebase'
import ColorThemeCard from './ColorThemeCard'
import styled from 'styled-components'

const ColorTemplates = (props) => {

    const updateColorPickers = (colorsArray) => {
        const colorsObject = {}
        colorsArray.forEach(color=> {
            if(color[0] === 'name') return
            if(color[0] === 'isDefault') return
            colorsObject[color[0]] = color[1]
            // document.getElementById(color[0]).value = color[1]
        })
    }

    const selectTheme = (themeColors) => {
        updateColorPickers(Object.entries(themeColors))
        props.dispatch(colors(themeColors))
        db.collection('users')
        .doc(props.userData.userID)
        .update({
            'preferences.colors': themeColors,
        })
        .catch(err=>console.log(err))
    }

    return(
        <Container>
            <Title>Color Themes:</Title>
            <Cards>
                {props.colorThemes.map((theme, index)=> {
                    return(
                        <ColorThemeCard index={index} deleteTheme={props.deleteTheme} selectTheme={selectTheme} theme={theme} key={index} />
                    )
                })}
            </Cards>
        </Container>
    )
}

const mapStateToProps = state => ({
    userData: state.app.userData,
    colorThemes: state.app.colorThemes,
    colors: state.app.colors,
})

export default connect(mapStateToProps)(ColorTemplates)

const Title = styled.h2`
    font-size: 1.125rem;
    margin-bottom: 10px;
    font-weight: 600;
`

const Container = styled.div`
    margin-bottom: 100px;
    padding-bottom: 40px;
`

const Cards = styled.div`
    /* display: flex;
    flex-direction: row;
    flex-wrap: wrap; */
    display: grid;
    grid-template-columns: repeat(auto-fit, minmax(220px, 1fr));
    grid-gap: 15px;
`