import { db } from '../../../firebase'
import { useEffect, useState } from 'react'
import ColorSelection from './ColorSelection'
import ColorTemplates from './ColorTemplates'
import { connect } from 'react-redux'

const ChangeColors = (props) => {

    const [themes, setThemes] = useState([])

    useEffect(()=> {
        db.collection('users')
        .doc(props.userData.userID)
        .collection('page-preferences')
        .doc('color-themes')
        .get()
        .then(data=> {
            setThemes(data.data().themes.reverse())
        })
        // eslint-disable-next-line
    }, [])

    const addTheme = (theme) => {
        const themesCopy = [...themes]
        themesCopy.unshift(theme)
        setThemes(themesCopy)
    }

    const deleteTheme = (themeIndex) => {
        const themesCopy = [...themes]
        themesCopy.splice(themeIndex, 1)
        deleteThemeFromState(themesCopy)
        deleteThemeFromDatabase(themesCopy)
    }

    const deleteThemeFromState = (newThemes) => {
        setThemes(newThemes)
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
            <ColorTemplates deleteTheme={deleteTheme} themes={themes} />
        </div>
    )
}

const mapStateToProps = state => ({
    userData: state.app.userData,
})

export default connect(mapStateToProps)(ChangeColors)