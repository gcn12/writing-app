import { db } from '../../firebase'
import { connect } from 'react-redux'
import firebase from 'firebase/app'
import { colors } from '../../redux/actions/appActions'
import { useState, useEffect } from 'react'
import styled from 'styled-components'
import ColorPicker from './ColorPicker'

const ColorSelection = (props) => {
    const [name, setName] = useState('')
    const [background, setBackground] = useState(props.colors.background)
    const [primaryText, setPrimaryText] = useState(props.colors.primaryText)
    const [sidebar, setSidebar] = useState(props.colors.sidebar)
    const [highlight, setHighlight] = useState(props.colors.highlight)
    const [secondary, setSecondary] = useState(props.colors.secondary)

    const handleColorPickerChange = (colorType, colorTypeName) => {
        if(colorType!==props.colors.colorType) {
            const timeout = setTimeout(()=>changeColor(colorTypeName, colorType), 400)
            return()=> clearTimeout(timeout)
        }
    }

    useEffect(()=> {
        return handleColorPickerChange(background, 'background')
        // eslint-disable-next-line
    }, [background, props.colors.background])

    useEffect(()=> {
        return handleColorPickerChange(primaryText, 'primaryText')
        // eslint-disable-next-line
    }, [primaryText, props.colors.primaryText])

    useEffect(()=> {
        return handleColorPickerChange(sidebar, 'sidebar')
        // eslint-disable-next-line
    }, [sidebar, props.colors.sidebar])

    useEffect(()=> {
        return handleColorPickerChange(highlight, 'highlight')
        // eslint-disable-next-line
    }, [highlight, props.colors.highlight])

    useEffect(()=> {
        return handleColorPickerChange(secondary, 'secondary')
        // eslint-disable-next-line
    }, [secondary, props.colors.secondary])

    useEffect(()=> {
        setBackground(props.colors.background)
        setHighlight(props.colors.highlight)
        setPrimaryText(props.colors.primaryText)
        setSidebar(props.colors.sidebar)
        setSecondary(props.colors.secondary)
    }, [props.colors])

    const changeColor = (type, color) => {
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
            background,
            primaryText,
            sidebar,
            highlight,
            secondary,
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
            <Title>Select colors</Title>
            <Background>
                <ColorPickers>
                    <ColorPicker ariaLabel='select background color' color={background} setColor={setBackground} name='Background' />
                    <ColorPicker ariaLabel='select primary text color'  color={primaryText} setColor={setPrimaryText} name='Primary text' />
                    <ColorPicker ariaLabel='select sidebar color'  color={sidebar} setColor={setSidebar} name='Sidebar' />
                    <ColorPicker ariaLabel='select highlight color'  color={highlight} setColor={setHighlight} name='Highlight' />
                    <ColorPicker ariaLabel='select secondary color'  color={secondary} setColor={setSecondary} name='Secondary' />
                </ColorPickers>
                <InputContainer>
                    <NameLabel htmlFor='theme-name-input'>Theme name:</NameLabel>
                    <ButtonInputContainer>
                        <ThemeName onKeyDown={onEnter} autoComplete='off' onChange={(e)=>setName(e.target.value)} id='theme-name-input'></ThemeName>
                        <SaveTheme onClick={saveTheme}>Save theme</SaveTheme>
                    </ButtonInputContainer>
                </InputContainer>
            </Background>
        </Container>
    )
}

const mapStateToProps = state => ({
    userData: state.app.userData,
    colors: state.app.colors,
})

export default connect(mapStateToProps)(ColorSelection)

const Background = styled.div`
    background-color: var(--sidebar);
    padding: 40px; 
    border-radius: 10px;
    margin-bottom: 20px;
    width: 100%;
`

const ButtonInputContainer = styled.div`
    display: flex;
    align-items: center;
    width: 100%;
    @media(max-width: 500px) {
        flex-direction: column;
        align-items: initial;
    }
`

const NameLabel = styled.label`
    font-size: 1.125rem;
    font-weight: 600;
    margin-bottom: 10px;
    margin-top: 40px;
`

const Container = styled.div`
    margin-top: 20px;
    width: 100%;
`

const Title = styled.h1`
    font-size: 2.25rem;
    font-weight: 600;
    margin-bottom: 25px;
`

const ThemeName = styled.input`
    min-height: 40px;
    margin-right: 10px;
    width: 300px;
    background-color: var(--background);
    border: none;
    color: var(--primary-text);
    font-size: 1.25rem;
    border-radius: 0;
    @media(max-width: 900px) {
        width: 100%;
    }
    @media(max-width: 500px) {
        width: 100%;
        margin-bottom: 10px;
        min-height: 50px;
        font-size: 1.5rem;
    }
`

const SaveTheme = styled.button`
    min-height: 40px;
    flex: 0;
    background-color: var(--primary-text);
    border: 1px solid var(--primary-text);
    color: var(--sidebar);
    font-size: 1.125rem;
    padding: 10px 30px;
    white-space: nowrap;
    @media(max-width: 900px) {
        width: 100%;
    }
    @media(max-width: 500px) {
        min-height: 50px;
    }
    @media(max-width: 400px) {
        padding: 10px 15px;
    }
`

const InputContainer = styled.div`
    display: flex;
    flex-direction: column;
    align-items: flex-start;
    width: 100%;
`

const ColorPickers = styled.div`
    display: grid;
    grid-template-columns: repeat(auto-fill, minmax(150px, 1fr));
    grid-gap: 30px;
    @media(max-width: 800px) {
        grid-template-columns: repeat(auto-fill, minmax(100px, 1fr));
    } 
` 