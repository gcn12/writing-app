import { db } from '../../../firebase'
import { connect } from 'react-redux'
import firebase from 'firebase'
import { colors } from '../../../redux/actions/appActions'
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

    useEffect(()=> {
        if(background!==props.colors.background) {
            const timeout = setTimeout(()=>changeColor('background', background), 400)
            return()=> clearTimeout(timeout)
        }
        // eslint-disable-next-line
    }, [background, props.colors.background])

    useEffect(()=> {
        if(primaryText!==props.colors.primaryText) {
            const timeout = setTimeout(()=>changeColor('primaryText', primaryText), 400)
            return()=> clearTimeout(timeout)
        }
        // eslint-disable-next-line
    }, [primaryText, props.colors.primaryText])

    useEffect(()=> {
        if(sidebar!==props.colors.sidebar) {
            const timeout = setTimeout(()=>changeColor('sidebar', sidebar), 400)
            return()=> clearTimeout(timeout)
        }
        // eslint-disable-next-line
    }, [sidebar, props.colors.sidebar])

    useEffect(()=> {
        if(highlight!==props.colors.highlight) {
            const timeout = setTimeout(()=>changeColor('highlight', highlight), 400)
            return()=> clearTimeout(timeout)
        }
        // eslint-disable-next-line
    }, [highlight, props.colors.highlight])

    useEffect(()=> {
        if(secondary!==props.colors.secondary) {
            const timeout = setTimeout(()=>changeColor('secondary', secondary), 400)
            return()=> clearTimeout(timeout)
        }
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
            <Title>Change colors</Title>
            <ColorPickers>
                <ColorPicker color={background} setColor={setBackground} name='Background' />
                <ColorPicker color={primaryText} setColor={setPrimaryText} name='Primary text' />
                <ColorPicker color={sidebar} setColor={setSidebar} name='Sidebar' />
                <ColorPicker color={highlight} setColor={setHighlight} name='Highlight' />
                <ColorPicker color={secondary} setColor={setSecondary} name='Secondary' />
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
    @media(max-width: 800px) {
        margin-top: 20px;
    }
`

const Title = styled.h1`
    font-size: 2rem;
`

const ThemeName = styled.input`
    height: 40px;
    margin: 0px 10px 0px 0px;
    width: 300px;
    flex: 1;
    background-color: var(--background);
    border: none;
    outline: 1px solid var(--primary-text);
    color: var(--primary-text);
    font-size: 20px;
    @media(max-width: 900px) {
        width: 100%;
    }
`

const SaveTheme = styled.button`
    height: 40px;
    flex: 0;
    background-color: var(--primary-text);
    outline: 1px solid var(--primary-text);
    color: var(--sidebar);
    font-size: 1.125rem;
    padding: 10px 30px;
    white-space: nowrap;
    @media(max-width: 400px) {
        padding: 10px 15px;
    }
`

const InputContainer = styled.div`
    display: flex;
    flex-direction: column;
    align-items: flex-start;
`

const ColorPickers = styled.div`
    margin: 40px 0;
    /* display: flex;
    flex-wrap: wrap; */
    display: grid;
    grid-template-columns: repeat(auto-fill, minmax(150px, 1fr));
    grid-gap: 30px;
    @media(max-width: 400px) {
        grid-template-columns: repeat(auto-fill, minmax(100px, 1fr));
    } 
` 