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
            <Title>Change colors</Title>
            <ColorPickers>
                <Picker>
                    <PickerLabel htmlFor='background'>Background:</PickerLabel>
                    <input defaultValue={props.colorThemes.background} onChange={()=>changeColor('background')} type='color' id='background' />
                </Picker>
                <Picker>
                    <PickerLabel htmlFor='primaryText'>Primary text:</PickerLabel>
                    <input defaultValue={props.colorThemes.primaryText} onChange={()=>changeColor('primaryText')} type='color' id='primaryText' />
                </Picker>
                <Picker>
                    <PickerLabel htmlFor='sidebar'>Sidebar:</PickerLabel>
                    <input defaultValue={props.colorThemes.sidebar} onChange={()=>changeColor('sidebar')}type='color' id='sidebar' />
                </Picker>
                <Picker>
                    <PickerLabel htmlFor='highlight'>Highlight:</PickerLabel>
                    <input defaultValue={props.colorThemes.highlight} onChange={()=>changeColor('highlight')}type='color' id='highlight' />
                </Picker>
            </ColorPickers>
            <InputContainer>
                <NameLabel htmlFor='theme-name-input'>Theme name:</NameLabel>
                <ThemeName autoComplete='off' onChange={(e)=>setName(e.target.value)} id='theme-name-input'></ThemeName>
                <SaveTheme onClick={saveTheme}>Save theme</SaveTheme>
            </InputContainer>
        </Container>
    )
}

const mapStateToProps = state => ({
    userData: state.app.userData,
    colorThemes: state.app.colorThemes,
})

export default connect(mapStateToProps)(ColorSelection)

const NameLabel = styled.h2`
    font-size: 1.125rem;
    font-weight: 600;
    margin-bottom: 10px;
`

const Container = styled.div`
    margin-top: 50px;
`

const PickerLabel = styled.label`
    margin-right: 5px;
`

const Title = styled.h1`
    font-size: 2rem;
`

const ThemeName = styled.input`
    height: 25px;
    margin-bottom: 10px;
`

const SaveTheme = styled.button`
    background-color: var(--primary-text);
    color: var(--sidebar);
    font-size: 1.125rem;
    padding: 10px;
    border-radius: 5px;
    margin-bottom: 70px;
`

const InputContainer = styled.div`
    display: flex;
    flex-direction: column;
    align-items: flex-start;
`

const ColorPickers = styled.div`
    display: flex;
    flex-wrap: wrap;
    margin: 40px 0;
    gap: 30px;
`

const Picker = styled.div`

`