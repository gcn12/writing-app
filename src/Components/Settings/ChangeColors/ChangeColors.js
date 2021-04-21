import { db } from '../../../firebase'
import { useEffect } from 'react'
import ColorSelection from './ColorSelection'
import ColorTemplates from './ColorTemplates'
import { connect } from 'react-redux'
import { colorThemes } from '../../../redux/actions/appActions'
import styled from 'styled-components'

const ChangeColors = (props) => {

    useEffect(()=> {
        if(props.colorThemes.length === 0) {
            getColors()
        }
        // eslint-disable-next-line
    }, [])

    const getColors = () => {
        db.collection('users')
        .doc(props.userData.userID)
        .collection('page-preferences')
        .doc('color-themes')
        .get()
        .then(data=> {
            props.dispatch(colorThemes(data.data().themes.reverse()))
        })
    }

    const addTheme = (theme) => {
        const themesCopy = [...props.colorThemes]
        themesCopy.unshift(theme)
        props.dispatch(colorThemes(themesCopy))
    }

    const deleteTheme = (themeIndex) => {
        const themesCopy = [...props.colorThemes]
        themesCopy.splice(themeIndex, 1)
        deleteThemeFromState(themesCopy)
        deleteThemeFromDatabase(themesCopy)
    }

    const deleteThemeFromState = (newThemes) => {
        props.dispatch(colorThemes(newThemes))
    }

    const deleteThemeFromDatabase = (newThemes) => {
        const reversedThemes = [...newThemes].reverse()
        db.collection('users')
        .doc(props.userData.userID)
        .collection('page-preferences')
        .doc('color-themes')
        .update({
            themes: reversedThemes
        })
        .catch(err=>console.log(err))
    }

    return(
        <Container>
            <ColorSelection addTheme={addTheme} />
            <ColorTemplates deleteTheme={deleteTheme} />
        </Container>
    )
}

const mapStateToProps = state => ({
    userData: state.app.userData,
    colorThemes: state.app.colorThemes
})

export default connect(mapStateToProps)(ChangeColors)

const Container = styled.div`
    width: 100%;
    /* height: 100vh; */
    padding: 0 30px;
    /* overflow: scroll; */
    /* --webkit-overflow-scrolling: touch; */
    @media(max-width: 800px) {
        margin-top: 100px;
        padding-bottom: 0px;
    }
    @media(max-width: 500px) {
        padding: 0 15px;
        padding-bottom: 0px;
    }
`