import { db } from '../../../firebase'
import { useEffect } from 'react'
import ColorSelection from './ColorSelection'
import ColorTemplates from './ColorTemplates'
import { connect } from 'react-redux'
import { colorThemes } from '../../../redux/actions/appActions'

const ChangeColors = (props) => {

    useEffect(()=> {
        db.collection('users')
        .doc(props.userData.userID)
        .collection('page-preferences')
        .doc('color-themes')
        .get()
        .then(data=> {
            props.dispatch(colorThemes(data.data().themes.reverse()))
        })
        // eslint-disable-next-line
    }, [])

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
        <div>
            <ColorSelection addTheme={addTheme} />
            <ColorTemplates deleteTheme={deleteTheme} />
        </div>
    )
}

const mapStateToProps = state => ({
    userData: state.app.userData,
})

export default connect(mapStateToProps)(ChangeColors)