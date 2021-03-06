import firebase from 'firebase/app'
import { useState, useEffect } from 'react'
import { useHistory } from 'react-router-dom'
import styled from 'styled-components'
import { db } from '../../firebase'
import { colors, userData } from '../../redux/actions/appActions'
import { connect } from 'react-redux'

const SignIn = (props) => {

    const history = useHistory()
    useEffect(()=> {
        setBackgroundColors()
        // eslint-disable-next-line
    }, [])

    const setBackgroundColors = () => {
        props.dispatch(colors({
            background: 'white',
            primaryText: 'black',
        }))
    }

    const [email, setEmail] = useState('')
    const [password, setPassword] = useState('')
    const [message, setMessage] = useState('')

    const getUserPreferences = (userID) => {
        db.collection('users')
        .doc(userID)
        .get()
        .then(data=> {
            const preferences = data.data().preferences
            const colorsData = preferences.colors
            props.dispatch(colors(colorsData))
            history.push('/writing-app/')
        })
        .catch((error) => console.log(error))
    }

    const signin = (e) => {
        e.preventDefault()
        firebase.auth().signInWithEmailAndPassword(email, password)
        .then((userCredential) => {
            const userID = userCredential.user.uid
            props.dispatch(userData({ userID }))
            getUserPreferences(userID)
        })
        .catch((error) => {
            setMessage('Invalid email or password')
            console.log(error)
        })
    }

    return(
        <Container>
            <Form onSubmit={signin}>
                <Logo>Welcome back</Logo>
                <InputLabelContainer>
                    <Label htmlFor='signin-email'>Email</Label>
                    <Email type='email' id='signin-email' onChange={(e)=>setEmail(e.target.value)} />
                </InputLabelContainer>
                <InputLabelContainer>
                    <Label htmlFor='signin-password'>Password</Label>
                    <Password id='signin-password' type='password' onChange={(e)=>setPassword(e.target.value)} />
                </InputLabelContainer>
                {message.length > 0 &&
                    <Message>{message}</Message>
                }
                <Submit onClick={signin}>SIGN IN</Submit>
            </Form>
            <BackgroundColorDecoration color='#96ffd7' blur='40px' minHeight='150px' minWidth='150px' height='15vw' width='15vw' top='0' left='0'  opacity='.8' />
            <BackgroundColorDecoration color='#cfc2ff' blur='50px' minHeight='150px' minWidth='150px' height='15vw' width='15vw' top='20%' right='0' opacity='.6' />
            <BackgroundColorDecoration color='#fdffb5' blur='60px' minHeight='200px' minWidth='200px' height='20vw' width='20vw' bottom='5%' left='25%' opacity='.5' />
        </Container>
    )
}

const mapStateToProps = state => ({})

export default connect(mapStateToProps)(SignIn)

const Message = styled.h3`
    color: red;
    margin-bottom: 20px;
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
    padding: 10px 50px;
    width: 70%;
    height: 50px;
    border-radius: 4px;
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
    margin-bottom: 30px;
`