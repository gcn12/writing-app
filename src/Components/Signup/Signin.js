import firebase from 'firebase'
import { useState, useEffect } from 'react'
import styled from 'styled-components'
import { colors } from '../../redux/actions/appActions'
import { connect } from 'react-redux'

const SignUp = (props) => {

    useEffect(()=> {
        props.dispatch(colors({
            background: 'white',
            primaryText: 'black',
        }))
        // eslint-disable-next-line
    }, [])

    const [email, setEmail] = useState('')
    const [password, setPassword] = useState('')

    const submit = () => {
        // firebase.auth().signInWithEmailAndPassword('hel2lo@gai1l.com', 'hello123')
        firebase.auth().signInWithEmailAndPassword(email, password)
        .then((userCredential) => {
            console.log('signed in')
        })
        .catch((error) => {
            console.log(error)
        });
    }

    return(
        <Container>
            <Label>Email</Label>
            <Username onChange={(e)=>setEmail(e.target.value)} />
            <Label>Password</Label>
            <Password onChange={(e)=>setPassword(e.target.value)} />
            <Submit onClick={submit}>Sign in</Submit>
        </Container>
    )
}

const mapStateToProps = state => ({})

export default connect(mapStateToProps)(SignUp)

const Label = styled.label`

`

const Submit = styled.button`
    background-color: black;
    color: white;
    padding: 10px 50px;
`

const Container = styled.div`
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    border: 1px solid black;
    border-radius: 5px;
    /* width: 20vw; */
`

const Username = styled.input`

`

const Password = styled.input`

`