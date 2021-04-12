import { db } from '../../../firebase'
import { connect } from 'react-redux'
import firebase from 'firebase'
import { colorThemes } from '../../../redux/actions/appActions'
import { useState } from 'react'

const ColorSelection = (props) => {
    const [name, setName] = useState('')

    const changeColor = (type) => {
        const color = document.getElementById(type).value
        props.dispatch(colorThemes({
            ...props.colorThemes,
            [type]: color
        }))
        db.collection('users')
        .doc(props.userData.userID)
        .update({
            ['preferences.colors.' + type]: color,
        })
        .catch(err=>console.log(err))
    }

    const saveTheme = () => {
        const colors = {
            background: document.getElementById('background').value,
            primaryText: document.getElementById('primaryText').value,
            sidebar: document.getElementById('sidebar').value
        }
        props.addTheme({
            colors,
            name,
        })
        db.collection('users')
        .doc(props.userData.userID)
        .collection('page-preferences')
        .doc('color-themes')
        .update({
            themes: firebase.firestore.FieldValue.arrayUnion({
                colors,
                name,
            })
        })
    }

    return(
        <div>
            <h1>Change colors</h1>
            <label htmlFor='background'>Pick background color:</label>
            <input defaultValue={props.colorThemes.background} onChange={()=>changeColor('background')} type='color' id='background' />
            <br></br>
            <br></br>
            <label htmlFor='primaryText'>Pick primary text color:</label>
            <input defaultValue={props.colorThemes.primaryText} onChange={()=>changeColor('primaryText')} type='color' id='primaryText' />
            <br></br>
            <br></br>
            <label htmlFor='sidebar'>Pick sidebar color:</label>
            <input defaultValue={props.colorThemes.sidebar} onChange={()=>changeColor('sidebar')}type='color' id='sidebar' />
            <br></br>
            <br></br>
            <input onChange={(e)=>setName(e.target.value)}></input>
            <button onClick={saveTheme}>Save theme</button>
            <br></br>
            <br></br>
        </div>
    )
}

const mapStateToProps = state => ({
    userData: state.app.userData,
    colorThemes: state.app.colorThemes,
})

export default connect(mapStateToProps)(ColorSelection)