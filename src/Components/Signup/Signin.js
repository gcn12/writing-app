import firebase from 'firebase'
import { useState, useEffect } from 'react'
import { useHistory } from 'react-router-dom'
import styled from 'styled-components'
import { colors } from '../../redux/actions/appActions'
import { connect } from 'react-redux'

const SignUp = (props) => {
    const history = useHistory()
    useEffect(()=> {
        props.dispatch(colors({
            background: 'white',
            primaryText: 'black',
        }))
        // eslint-disable-next-line
    }, [])

    const [email, setEmail] = useState('')
    const [password, setPassword] = useState('')

    const submit = (e) => {
        e.preventDefault()
        // firebase.auth().signInWithEmailAndPassword('hel2lo@gai1l.com', 'hello123')
        firebase.auth().signInWithEmailAndPassword(email, password)
        .then((userCredential) => {
            console.log('signed in')
            history.push('/writing-app/dashboard')
        })
        .catch((error) => {
            console.log(error)
        });
        return true
    }

    return(
        <Container>
            <Form onSubmit={submit}>
                <Logo>Redraft</Logo>
                <InputLabelContainer>
                    <Label>Email</Label>
                    <Username onChange={(e)=>setEmail(e.target.value)} />
                </InputLabelContainer>
                <InputLabelContainer>
                    <Label>Password</Label>
                    <Password type='password' onChange={(e)=>setPassword(e.target.value)} />
                </InputLabelContainer>
                <Submit onClick={submit}>SIGN IN</Submit>
            </Form>
            <BackgroundColorDecoration color='#96ffd7' blur='40px' minHeight='150px' minWidth='150px' height='15vw' width='15vw' top='0' left='0'  opacity='.7' />
            <BackgroundColorDecoration color='#cfc2ff' blur='50px' minHeight='150px' minWidth='150px' height='15vw' width='15vw' top='20%' right='0' opacity='.6' />
            <BackgroundColorDecoration color='#fdffb5' blur='80px' minHeight='200px' minWidth='200px' height='20vw' width='20vw' top='65%' left='25%' opacity='.5' />
        </Container>
    )
}

const mapStateToProps = state => ({})

export default connect(mapStateToProps)(SignUp)

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
    /* border: 1px solid black; */
    box-shadow: 0px 5px 7px rgba(0, 0, 0, .3);
    background-color: white;
    border-radius: 5px;
    height: 400px;
    width: 400px;
    position: relative;
    z-index: 1;
    @media(max-width: 800px) {
        width: 70vw;
    }
`

const Submit = styled.button`
    background-color: black;
    color: white;
    padding: 10px 50px;
    width: 70%;
    height: 50px;
    border-radius: 4px;
`

const Container = styled.div`
    display: grid;
    place-items: center;
    height: 100%;
    width: 100%;
`

const Username = styled.input`
    width: 100%;
    height: 35px;
    margin-bottom: 20px;
    font-size: 20px;
`

const Password = styled.input`
    width: 100%;
    height: 35px;
    margin-bottom: 30px;
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
    font-weight: 700;
    margin-bottom: 30px;
    /* align-self: flex-start; */
`