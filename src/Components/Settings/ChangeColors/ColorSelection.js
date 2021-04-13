import { db } from '../../../firebase'
import { connect } from 'react-redux'
import firebase from 'firebase'
import { colorThemes } from '../../../redux/actions/appActions'
import { useState } from 'react'
import styled from 'styled-components'

const ColorSelection = (props) => {
    const [name, setName] = useState('')

    const changeColor = (type) => {
        const color = document.getElementById(type).value
        props.dispatch(colorThemes({
            ...props.colorThemes,
            [type]: color,
            name: null,
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
            sidebar: document.getElementById('sidebar').value,
            highlight: document.getElementById('highlight').value,
            name,
        }
        props.addTheme({
            colors,
        })
        db.collection('users')
        .doc(props.userData.userID)
        .collection('page-preferences')
        .doc('color-themes')
        .update({
            themes: firebase.firestore.FieldValue.arrayUnion({
                colors,
            })
        })
    }

    return(
        <Container>
            <h1>Change colors</h1>
            <ColorPickers>
                <Picker>
                    <label htmlFor='background'>Background:</label>
                    <input defaultValue={props.colorThemes.background} onChange={()=>changeColor('background')} type='color' id='background' />
                </Picker>
                <Picker>
                    <label htmlFor='primaryText'>Primary text:</label>
                    <input defaultValue={props.colorThemes.primaryText} onChange={()=>changeColor('primaryText')} type='color' id='primaryText' />
                </Picker>
                <Picker>
                    <label htmlFor='sidebar'>Sidebar:</label>
                    <input defaultValue={props.colorThemes.sidebar} onChange={()=>changeColor('sidebar')}type='color' id='sidebar' />
                </Picker>
                <Picker>
                    <label htmlFor='highlight'>Highlight:</label>
                    <input defaultValue={props.colorThemes.highlight} onChange={()=>changeColor('highlight')}type='color' id='highlight' />
                </Picker>
            </ColorPickers>
            <input onChange={(e)=>setName(e.target.value)}></input>
            <button onClick={saveTheme}>Save theme</button>
        </Container>
    )
}

const mapStateToProps = state => ({
    userData: state.app.userData,
    colorThemes: state.app.colorThemes,
})

export default connect(mapStateToProps)(ColorSelection)

const Container = styled.div`

`

const ColorPickers = styled.div`
    display: flex;
    flex-wrap: wrap;
    margin: 40px 0;
    gap: 30px;
`

const Picker = styled.div`

`