import { db } from '../../../firebase'
import { connect } from 'react-redux'
import firebase from 'firebase'
import { colors } from '../../../redux/actions/appActions'
import { useState } from 'react'
import styled from 'styled-components'

const ColorSelection = (props) => {
    const [name, setName] = useState('')

    const changeColor = (type) => {
        const color = document.getElementById(type).value
        props.dispatch(colors({
            ...props.colors,
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
            secondary: document.getElementById('secondary').value,
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
        document.getElementById('theme-name-input').value = ''
    }

    const onEnter = (e) => {
        if(e.key==='Enter') saveTheme()
    }

    return(
        <Container>
            <Title>Change colors</Title>
            <ColorPickers>
                <Picker>
                    <PickerLabel htmlFor='background'>Background:</PickerLabel>
                    <input defaultValue={props.colors.background} onChange={()=>changeColor('background')} type='color' id='background' />
                </Picker>
                <Picker>
                    <PickerLabel htmlFor='primaryText'>Primary text:</PickerLabel>
                    <input defaultValue={props.colors.primaryText} onChange={()=>changeColor('primaryText')} type='color' id='primaryText' />
                </Picker>
                <Picker>
                    <PickerLabel htmlFor='sidebar'>Sidebar:</PickerLabel>
                    <input defaultValue={props.colors.sidebar} onChange={()=>changeColor('sidebar')}type='color' id='sidebar' />
                </Picker>
                <Picker>
                    <PickerLabel htmlFor='highlight'>Highlight:</PickerLabel>
                    <input defaultValue={props.colors.highlight} onChange={()=>changeColor('highlight')}type='color' id='highlight' />
                </Picker>
                <Picker>
                    <PickerLabel htmlFor='secondary'>Secondary:</PickerLabel>
                    <input defaultValue={props.colors.secondary} onChange={()=>changeColor('secondary')}type='color' id='secondary' />
                </Picker>
            </ColorPickers>
            <InputContainer>
                <NameLabel htmlFor='theme-name-input'>Theme name:</NameLabel>
                <ButtonInputContainer>
                    <ThemeName onKeyDown={onEnter} autoComplete='off' onChange={(e)=>setName(e.target.value)} id='theme-name-input'></ThemeName>
                    <SaveTheme onClick={saveTheme}>Save theme</SaveTheme>
                </ButtonInputContainer>
            </InputContainer>
        </Container>
    )
}

const mapStateToProps = state => ({
    userData: state.app.userData,
    colors: state.app.colors,
})

export default connect(mapStateToProps)(ColorSelection)

const ButtonInputContainer = styled.div`
    display: flex;
    align-items: center;
    margin-bottom: 70px;
`

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
    height: 40px;
    margin: 0px 10px 0px 0px;
    width: 300px;
    background-color: var(--background);
    border: none;
    outline: 1px solid var(--primary-text);
    color: var(--primary-text);
    font-size: 20px;
    @media(max-width: 900px) {
        max-width: 300px;
        width: auto;
    }
`

const SaveTheme = styled.button`
    height: 40px;
    background-color: var(--primary-text);
    outline: 1px solid var(--primary-text);
    color: var(--sidebar);
    font-size: 1.125rem;
    padding: 10px 30px;
`

const InputContainer = styled.div`
    display: flex;
    flex-direction: column;
    align-items: flex-start;
`

const ColorPickers = styled.div`
    margin: 40px 0;
    display: flex;
    flex-wrap: wrap;
    /* gap: 30px; */
`

const Picker = styled.div`
    margin-right: 30px;
    margin-bottom: 30px;
`