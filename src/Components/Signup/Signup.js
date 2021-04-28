import firebase from 'firebase'
import { db } from '../../firebase'
import styled from 'styled-components'
import { connect } from 'react-redux'
import { colors } from '../../redux/actions/appActions'
import { useEffect, useState } from 'react'
import { useHistory } from 'react-router-dom'
import moment from 'moment'

const SignUp = (props) => {

    const [email, setEmail] = useState('')
    const [password, setPassword] = useState('')
    const [message, setMessage] = useState('')
    const history = useHistory()
    useEffect(()=> {
        props.dispatch(colors({
            background: 'white',
            primaryText: 'black',
        }))
        // eslint-disable-next-line
    }, [])

    const addUserIDToDatabase = (userID) => {
        return db.collection('users').doc(userID).set({
            userID: userID,
        })
    }

    const addUserColorsToDatabase = (userID) => {
        return db.collection('users').doc(userID).set({
            preferences: {
                colors: {
                    name: 'Light 1',
                    background: '#c7b9ca',
                    highlight: '#e3e3e3',
                    primaryText: '#0f0f0f',
                    secondary: '#ffffff',
                    sidebar: '#f7f7f7',
                }
            }
        })
        .catch(err=>console.log(err))
    }
    
    const addColorThemesToDatabase = (userID) => {
        return db.collection('users')
        .doc(userID)
        .collection('page-preferences')
        .doc('color-themes')
        .set({
            themes
        })
        .catch(err=>console.log(err))
    }

    const addGoalsToDatabase = (userID) => {
        return db.collection('users')
        .doc(userID)
        .collection('goals')
        .doc('daily-goal')
        .set({
            goal: 100,
            wordsWritten: {
                date: moment().format('L'),
                words: 0,
            }
        })
        .catch(err=>console.log(err))
    }

    const addTasksToDatabase = (userID) => {
        return db.collection('users')
        .doc(userID)
        .collection('goals')
        .doc('todo')
        .set({
            todo: []
        })
        .catch(err=>console.log(err))
    }

    const createFilesFolders = (userID) => {
        return db.collection('users')
        .doc(userID)
        .collection('files-folders')
        .doc('preferences')
        .set({
            parentID: userID, 
            sortMethod: 'dateDesc'
        })
        .catch(err=>console.log(err))
    }

    const addColorsToState = () => {
        const colorsObj = {
            name: 'Light 1',
            background: '#c7b9ca',
            highlight: '#e3e3e3',
            primaryText: '#0f0f0f',
            secondary: '#ffffff',
            sidebar: '#f7f7f7',
        }
        props.dispatch(colors(colorsObj))
    }

    const addToDoItems = (userID) => {
        return db.collection('users')
        .doc(userID)
        .collection('goals')
        .doc('todo')
        .set({
            todo: [
                {
                    goal: 'And add some of your own.',
                },
                {
                    goal: 'Feel free to delete these ones.',
                },
                {
                    goal: 'This is where you can add tasks.',
                },
            ]
        })
    }

    const submit = (e) => {
        e.preventDefault()
        firebase.auth().createUserWithEmailAndPassword(email, password)
        .then((userCredential) => {
            // Signed in 
            const userID = userCredential.user.uid
            addUserIDToDatabase(userID).then(()=> {
                addUserColorsToDatabase(userID)
                addColorThemesToDatabase(userID)
                addGoalsToDatabase(userID)
                addTasksToDatabase(userID)
                createFilesFolders(userID)
                addToDoItems(userID)
                addColorsToState()
                history.push('/writing-app')
            })
        })
        .catch((error) => {
            if(error.code==='auth/invalid-email') {
                setMessage('Invalid email')
            }
            if(error.code==='auth/weak-password') {
                setMessage('Password must be at least six characters')
            }
        });
    }
    return(
        <Container>
            <Form>
                <Logo>Sign up</Logo>
                <InputLabelContainer>
                    <Label htmlFor='signup-email'>Email</Label>
                    <Email id='signup-email' type='email' onChange={(e)=>setEmail(e.target.value)} /> 
                </InputLabelContainer>
                <InputLabelContainer>
                    <Label htmlFor='signup-password'>Password</Label>
                    <Password id='signup-password' onChange={(e)=>setPassword(e.target.value)} type='password' />
                </InputLabelContainer>
                {message.length > 0 &&
                    <Message>{message}</Message>
                }
                <Submit onClick={submit}>CREATE ACCOUNT</Submit>
            </Form>
            <BackgroundColorDecoration color='#c4ffd6' blur='50px' minHeight='150px' minWidth='150px' height='15vw' width='15vw' top='0' left='0'  opacity='1' />
            <BackgroundColorDecoration color='#fffca8' blur='50px' minHeight='150px' minWidth='150px' height='15vw' width='15vw' top='20%' right='0' opacity='.7' />
            <BackgroundColorDecoration color='#b5f1ff' blur='50px' minHeight='200px' minWidth='200px' height='20vw' width='20vw' bottom='2%' left='30%' opacity='.9' />
        </Container>
    )
}

const mapStateToProps = state => ({})

export default connect(mapStateToProps)(SignUp)

const Message = styled.h3`
    color: red;
    margin-bottom: 20px;
    padding: 0 10px;
`

const InputLabelContainer = styled.div`
    display: flex;
    flex-direction: column;
    width: 70%;
`

const Label = styled.label`
    margin-bottom: 5px;
`

const Form = styled.form`
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    box-shadow: 0px 5px 7px rgba(0, 0, 0, .3);
    background-color: white;
    border-radius: 5px;
    height: 400px;
    width: 400px;
    position: relative;
    z-index: 1;
    @media(max-width: 500px) {
        width: 80vw;
    }
`

const Submit = styled.button`
    background-color: black;
    color: white;
    /* padding: 10px 50px; */
    width: 70%;
    height: 50px;
    text-align: center;
    border-radius: 4px;
    white-space: nowrap;
    @media(max-width: 600px) {
        font-size: .9rem;
    }
`

const Container = styled.div`
    display: grid;
    place-items: center;
    height: 100%;
    width: 100%;
`

const Email = styled.input`
    width: 100%;
    height: 35px;
    margin-bottom: 20px;
    font-size: 20px;
`

const Password = styled.input`
    width: 100%;
    height: 35px;
    margin-bottom: 30px;
    font-size: 20px;
`

const BackgroundColorDecoration = styled.div`
    height: ${props=>props.height}; 
    width: ${props=>props.width};
    min-height: ${props=>props.minHeight}; 
    min-width: ${props=>props.minWidth};
    border-radius: 50%;
    background-color: ${props=>props.color};
    filter: blur(${props=>props.blur});
    opacity: ${props=>props.opacity};
    position: absolute;
    top: ${props=>props.top};
    left: ${props=>props.left};
    bottom: ${props=>props.bottom};
    right: ${props=>props.right};
`

const Logo = styled.h1`
    font-size: 2rem;
    font-weight: 600;
    margin-bottom: 20px;
    /* align-self: flex-start; */
`

const themes = [
    {colors: {
        isDefault: true,
        name: 'Light 1',
        background: '#c7b9ca',
        highlight: '#e3e3e3',
        primaryText: '#0f0f0f',
        secondary: '#ffffff',
        sidebar: '#f7f7f7',
    }},
    {colors: {
        isDefault: true,
        name: 'Light 2',
        background: '#ffb4a2',
        highlight: '#e4c5b4',
        primaryText: '#1a0f2c',
        secondary: '#ffe6e0',
        sidebar: '#ffd7c2',
    }},
    {colors: {
        isDefault: true,
        name: 'Light 3',
        background: '#a7bed3',
        highlight: '#b3ced5',
        primaryText: '#000000',
        secondary: '#f1ffc4',
        sidebar: '#c6e2e9',
    }},
    {colors: {
        isDefault: true,
        name: 'Dark 1',
        background: '#433f4b',
        highlight: '#3e3d4d',
        primaryText: '#fbebff',
        secondary: '#53566a',
        sidebar: '#141415',
    }},
    {colors: {
        isDefault: true,
        name: 'Dark 2',
        background: '#847996',
        highlight: '#442b44',
        primaryText: '#F4ECD6',
        secondary: '#5f576c',
        sidebar: '#2c142c',
    }},
    {colors: {
        isDefault: true,
        name: 'Dark 3',
        background: '#294c60',
        highlight: '#192a37',
        primaryText: '#ffefd3',
        secondary: '#adb6c4',
        sidebar: '#001b2e',
    }},
]