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
            setThemes(data.data().themes)
        })
        // eslint-disable-next-line
    }, [])

    const addTheme = (theme) => {
        const themesCopy = [...themes]
        themesCopy.push(theme)
        setThemes(themesCopy)
    }

    return(
        <div>
            <ColorSelection addTheme={addTheme} />
            <ColorTemplates themes={themes} />
        </div>
    )
}

const mapStateToProps = state => ({
    userData: state.app.userData,
})

export default connect(mapStateToProps)(ChangeColors)